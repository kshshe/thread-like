import { parallelize } from "./parallelize.ts";
import { isAborted } from "./utils/isAborted.ts";
import { everyNth } from "./utils/everyNth.ts";

window.parallelize = parallelize;
window.parallelize.isAborted = isAborted;
window.parallelize.everyNth = everyNth;
