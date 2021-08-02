function noop() {}

function doSmth() {
  const time = performance.now();
  while (performance.now() - time < 0.3) {
    noop();
  }
}

const getLongTask = (task) => {
  const longTask = function* long() {
    let count = 0;
    while (count++ < 2500) {
      task.iterations = count;
      yield doSmth();
    }
    return count;
  };
  longTask.name = task.name;
  return parallelize(longTask);
};

const tasksList = new Set();
let tasks = 0;
async function runNonBlockingTask() {
  const name = `task ${tasks++}`;
  const task = {
    name,
    iterations: 0,
  };
  tasksList.add(task);
  await getLongTask(task)();
  tasksList.delete(task);
}

function runNonBlockingTasksX10() {
  for (let i = 0; i < 10; i++) {
    runNonBlockingTask();
  }
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
