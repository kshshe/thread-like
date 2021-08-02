import { Aborted, TASKS_LIMIT, TASKS_PAUSE } from "./utils/constants";
import { wait } from "./utils/wait";

type Parallelize = (generator: GeneratorFunction) => TaskRunner;
type TaskRunner = () => TaskPromise;
type TaskInterface = {
  generator: Generator;
  aborted: boolean;
  result?: IteratorResult<unknown>;
  resolve: (reason?: any) => void;
  reject: (reason?: any) => void;
};
interface TaskPromise extends Promise<unknown> {
  abort: (resolve?: boolean) => void;
}

const activeTasks: Set<TaskInterface> = new Set();

let loopIsActive = false;
const checkDate = (startTime: number) => Date.now() - startTime < TASKS_LIMIT;
const loop = async function loop() {
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
        if (!checkDate(taskStartTime)) {
          break tasksLoop;
        }
        if (task.aborted) {
          activeTasks.delete(task);
          continue;
        }
        try {
          task.result = task.generator.next();
        } catch (e) {
          activeTasks.delete(task);
          task.reject(e);
          continue;
        }
        if (task.result.done) {
          activeTasks.delete(task);
          task.resolve(task.result.value);
          continue;
        }
      }
    }
    await wait(TASKS_PAUSE);
  }
};

export const parallelize: Parallelize = function parallelize(generator) {
  const parallelRunner: TaskRunner = function parallelRunner() {
    const taskInterface: Partial<TaskInterface> = {
      generator: generator(),
      aborted: false,
    };

    const promise = new Promise((res, rej) => {
      taskInterface.resolve = res;
      taskInterface.reject = rej;
    }) as TaskPromise;

    activeTasks.add(taskInterface as TaskInterface);

    promise.abort = function abort(resolve = true) {
      const task = taskInterface as TaskInterface;
      task.aborted = true;
      if (resolve) {
        task.resolve(Aborted);
      } else {
        task.reject(Aborted);
      }
    };
    loop();
    return promise;
  };

  return parallelRunner;
};
