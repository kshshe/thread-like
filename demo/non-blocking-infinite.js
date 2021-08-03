function noop() {}

function doSmth() {
  const time = performance.now();
  while (performance.now() - time < 0.3) {
    noop();
  }
}

let count = 0;
const longTask = parallelize(function* long() {
  while (true) {
    count++;
    yield doSmth();
  }
});

longTask();

const tasksBlock = document.querySelector(".tasks");
setInterval(() => {
  tasksBlock.innerHTML = `Iterations: ${count}`;
}, 10);
