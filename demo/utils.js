const log = document.querySelector(".log");
const fpsLine = document.querySelector(".fps__line");
const counterBlock = document.querySelector(".counter");

let lineNumber = 0;
function logToPage(line) {
  log.innerHTML = `${lineNumber++}: ${line}<br>${log.innerHTML}`;
}

function fpsMeter() {
  let prevTime = Date.now();
  let frames = 0;
  requestAnimationFrame(function loop() {
    const time = Date.now();
    frames++;
    if (time > prevTime + 1000) {
      let fps = Math.round((frames * 1000) / (time - prevTime));
      prevTime = time;
      frames = 0;

      fpsLine.innerText = "FPS: " + fps;
      fpsLine.style.width = `${Math.min(fps / 60, 1) * 100}%`;
    }

    requestAnimationFrame(loop);
  });
}

fpsMeter();

let counter = 0;
setInterval(() => {
  counterBlock.innerText = counter++;
}, 50);
