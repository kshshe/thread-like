import { parallelize } from "./parallelize.ts";
import { isAborted } from "./utils/isAborted.ts";

window.parallelize = parallelize;
window.parallelize.isAborted = isAborted;
