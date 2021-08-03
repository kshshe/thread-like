import { Aborted } from "./utils/constants";
import { statLogger } from "./utils/statLogger";

import {
  TaskInterface,
  Parallelize,
  ParallelizeConfig,
  TaskRunner,
  TaskPromise,
} from "./types/parallelize";
import { activeTasks } from "./activeTasks";
import { loop } from "./loop";

export const parallelize: Parallelize = function parallelize(
  generator,
  config = {}
) {
  const configWithDefaults: ParallelizeConfig = {
    debug: false,
    ...config,
  };
  const parallelRunner: TaskRunner = function parallelRunner(...attrs) {
    const logger = configWithDefaults.debug
      ? statLogger(generator.name || "anonymous")
      : undefined;
    const taskInterface: Partial<TaskInterface> = {
      generator: generator(...attrs),
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
    if (configWithDefaults.maxTime) {
      const abortTimeout = setTimeout(() => {
        taskInterface.aborted = true;
      }, configWithDefaults.maxTime);
      promise.finally(() => clearTimeout(abortTimeout));
    }
    if (logger) {
      logger.start();
    }
    return promise;
  };

  return parallelRunner;
};
