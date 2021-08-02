import { Aborted, TASKS_LIMIT, TASKS_PAUSE } from "./utils/constants";
import { Logger, statLogger } from "./utils/statLogger";
import { wait } from "./utils/wait";

type Parallelize = (
  generator: GeneratorFunction,
  config?: ParallelizeConfig
) => TaskRunner;
type ParallelizeConfig = {
  debug?: boolean;
};
type TaskRunner = () => TaskPromise;
type TaskInterface = {
  generator: Generator;
  aborted: boolean;
  result?: IteratorResult<unknown>;
  resolve: (reason?: any) => void;
  reject: (reason?: any) => void;
  logger?: Logger;
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

export const parallelize: Parallelize = function parallelize(
  generator,
  config = {}
) {
  const configWithDefaults: ParallelizeConfig = {
    debug: false,
    ...config,
  };
  const parallelRunner: TaskRunner = function parallelRunner() {
    const logger = configWithDefaults.debug
      ? statLogger(generator.name || "anonymous")
      : undefined;
    const taskInterface: Partial<TaskInterface> = {
      generator: generator(),
      aborted: false,
      logger,
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
    if (logger) {
      logger.start();
    }
    return promise;
  };

  return parallelRunner;
};
