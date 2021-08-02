function noop() {}

function doSmth() {
  const time = performance.now();
  while (performance.now() - time < 0.3) {
    noop();
  }
}

const l1 = parallelize(function* l1() {
  let count = 0;
  while (count++ < 2500) {
    doSmth();
    yield;
  }
  return count;
});

const l2 = parallelize(function* l2() {
  let count = 0;
  while (count++ < 2500) {
    doSmth();
    yield;
  }
  return count;
});

const l3 = parallelize(function* l3() {
  let count = 0;
  while (count++ < 2500) {
    doSmth();
    yield;
  }
  return count;
});

const longNonBlockingOperation = parallelize(function* longBlockingOperation() {
  let count = 0;
  while (count++ < 2500) {
    yield doSmth();
  }
  return count;
});

let lastTask;
async function runNonBlockingTask() {
  const startTime = Date.now();
  logToPage("");
  logToPage("non-blocking start");
  if (lastTask) {
    logToPage("non-blocking aborted");
    lastTask.abort();
  }
  lastTask = longNonBlockingOperation();
  const result = await lastTask;
  if (parallelize.isAborted(result)) {
    return;
  }
  lastTask = null;
  const endTime = Date.now();
  logToPage(`non-blocking time ${Math.round(endTime - startTime)}`);
  logToPage("non-blocking end");
}
