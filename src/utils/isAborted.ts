import { Aborted } from "./constants";

export const isAborted = (value: unknown) => value === Aborted;
