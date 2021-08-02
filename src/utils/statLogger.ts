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
    },
    start: () => {
      console.log(`${name} started`);
    },
    end: () => {
      const sum = ticks.reduce((a, b) => a + b, 0);
      const avg = (sum / ticks.length).toFixed(2);
      console.log(
        `${name}\nTicks ${ticks.length}\nAverage time is ${avg}ms/tick`
      );
      console.log(`${name} finished`);
    },
  };
};
