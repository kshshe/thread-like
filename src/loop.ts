import { TASKS_LIMIT, TASKS_PAUSE } from "./utils/constants";
import { wait } from "./utils/wait";

import { activeTasks } from "./activeTasks";

let loopIsActive = false;
const checkDate = (startTime: number) => Date.now() - startTime < TASKS_LIMIT;

export const loop = async function loop() {
  if (loopIsActive) {
    return;
  }
  loopIsActive = true;
  while (true) {
    if (activeTasks.size === 0) {
      loopIsActive = false;
      return;
    }
    let taskStartTime = Date.now();
    tasksLoop: while (checkDate(taskStartTime)) {
      for (const task of activeTasks) {
        const onTaskEnd = () => {
          activeTasks.delete(task);
          if (task.logger) {
            task.logger.end();
          }
        };
        if (!checkDate(taskStartTime)) {
          break tasksLoop;
        }
        if (task.aborted) {
          onTaskEnd();
          continue;
        }
        try {
          task.result = task.generator.next();
        } catch (e) {
          onTaskEnd();
          task.reject(e);
          continue;
        }
        if (task.result.done) {
          onTaskEnd();
          task.resolve(task.result.value);
          continue;
        }
        if (task.logger) {
          task.logger.tick();
        }
      }
    }
    await wait(TASKS_PAUSE);
  }
};
