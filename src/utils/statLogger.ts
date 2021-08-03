import { TASKS_LIMIT } from "./constants";

export type Logger = {
  tick: () => void;
  end: () => void;
  start: () => void;
};

export const statLogger = (name: string): Logger => {
  let ticks: number[] = [];
  let lastTickTime: number = performance.now();
  return {
    tick: () => {
      ticks.push(performance.now() - lastTickTime);
      lastTickTime = performance.now();
    },
    start: () => {
      console.log(`${name} started`);
    },
    end: () => {
      const sum = ticks.reduce((a, b) => a + b, 0);
      const avg = sum / ticks.length;
      console.log(
        `${name}\nTicks ${ticks.length}\nAverage time is ${avg.toFixed(
          2
        )}ms/tick.`
      );
      if (avg < TASKS_LIMIT / 200) {
        console.warn(
          "One iteration takes too little time. Try to yield less often."
        );
      }
      if (avg > TASKS_LIMIT / 2) {
        console.warn("One iteration takes too long. Try to yield more often.");
      }
      console.log(`${name} finished`);
    },
  };
};
