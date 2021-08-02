function noop() {}

function doSmth() {
  const time = performance.now();
  while (performance.now() - time < 0.3) {
    noop();
  }
}

const longNonBlockingOperation = parallelize(
  function* longBlockingOperation(task) {
    let count = 0;
    while (count++ < 2500) {
      task.iterations = count;
      yield doSmth();
    }
    return count;
  },
  {
    debug: true,
  }
);

const tasksList = new Set();
let tasks = 0;
let lastTask;
async function runNonBlockingTask() {
  const startTime = Date.now();
  const name = `task ${tasks++}`;
  const task = {
    name,
    iterations: 0,
  };
  tasksList.add(task);
  logToPage("");
  logToPage("non-blocking start");
  if (lastTask) {
    logToPage("non-blocking aborted");
    lastTask.abort();
  }
  lastTask = longNonBlockingOperation(task);
  const result = await lastTask;
  tasksList.delete(task);
  if (parallelize.isAborted(result)) {
    return;
  }
  lastTask = null;
  const endTime = Date.now();
  logToPage(`non-blocking time ${Math.round(endTime - startTime)}`);
  logToPage("non-blocking end");
}

const tasksBlock = document.querySelector(".tasks");
setInterval(() => {
  tasksBlock.innerHTML = [...tasksList]
    .map((timing) => {
      const name = timing.name.padEnd(7);
      const ticks = `${timing.iterations}`.padStart(4);
      const percent = `${Math.round(
        (100 * timing.iterations) / 2500
      )}%`.padStart(4);
      const lineDone = Math.round(timing.iterations / 100);
      return `<pre class="tasks__line">${`${name} ${percent} ${ticks}/2500`.padEnd(
        13
      )} ${"#".repeat(lineDone)}${"-".repeat(25 - lineDone)}</pre>`;
    })
    .join("");
}, 10);
