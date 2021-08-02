function noop() {}

function doSmth() {
  const time = performance.now();
  while (performance.now() - time < 0.3) {
    noop();
  }
}

function longBlockingOperation() {
  let count = 0;
  while (count++ < 2500) {
    doSmth();
  }
}

function runBlockingTask() {
  const startTime = Date.now();
  logToPage("");
  logToPage("blocking start");
  longBlockingOperation();
  const endTime = Date.now();
  logToPage(`blocking time ${Math.round(endTime - startTime)}`);
  logToPage("blocking end");
}
