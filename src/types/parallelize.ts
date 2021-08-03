import { Logger } from "../utils/statLogger";

export type Parallelize = (
  generator: GeneratorFunction,
  config?: ParallelizeConfig
) => TaskRunner;

export type ParallelizeConfig = {
  debug?: boolean;
  maxTime?: number;
};

export type TaskRunner = (...attrs: unknown[]) => TaskPromise;

export type TaskInterface = {
  generator: Generator;
  aborted: boolean;
  result?: IteratorResult<unknown>;
  resolve: (reason?: any) => void;
  reject: (reason?: any) => void;
  logger?: Logger;
};

export interface TaskPromise extends Promise<unknown> {
  abort: (resolve?: boolean) => void;
}
