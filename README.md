# Thread-like

A tool, which allows you to make non-parallel function work like they are running in separate threads.

[![npm version](https://badge.fury.io/js/thread-like.svg)](https://badge.fury.io/js/thread-like)

- [Installation](#installation)
- [Demo](#demo)
- [Why?](#why)
- [API](#API)
- [Helpers](#helpers)

## Installation

```bash
npm install thread-like
```

```html
<script src="https://cdn.jsdelivr.net/npm/thread-like/lib/parallelize.js"></script>
```

## Demo

- [Sync vs parellel executing](http://htmlpreview.github.io/?https://github.com/kshshe/thread-like/blob/master/demo/index.html)
- [Several parallel tasks](http://htmlpreview.github.io/?https://github.com/kshshe/thread-like/blob/master/demo/multi.html)
- [`while (true)`](http://htmlpreview.github.io/?https://github.com/kshshe/thread-like/blob/master/demo/infinite.html)

## Why?

- You need to calculate something big
- It takes a lot of time and blocks the main thread (UI)
- You want to make it work in parallel

For example, imagine you have to run `doSmth()` (executes in 1-2 ms) many times:

```javascript
function longBlockingOperation() {
  let count = 0;
  while (count++ < 2500) {
    doSmth();
  }
}
```

If you just run it, the page will be blocked for about a second. Enough to think that something is wrong with the service.

DevTools Profiler will show something like this: the thread is blocked for 964 ms by `longBlockingOperation`.

![Profiler with sync execution](./images/sync.png)

`thread-like` allows you to make such function:

- run in parallel
- stoppable
- non-blocking

Execution will be split into small parts:

![](./images/parallel.png)

## API

### `parallelize(fn*, options)`

```javascript
import { parallelize } from "thread-like";

const config = {}; // optional

const longNonBlockingOperation = parallelize(function* longBlockingOperation() {
  let count = 0;
  while (count++ < 2500) {
    yield doSmth();
  }
  return count;
}, config);
```

| Config | Type       | Default |  Description  |
| ------------ | --------- | --------------------- | --------------------- |
| `debug`      | `boolean` | `false`               | Show debug messages in console |
| `maxTime`    | `number`  | `null`                | Max time of execution in ms. If `null` - no limit |

1. You should make target function a generator (`function*`, [more](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/function*))
2. You have to mark places for splits with `yield`

> It will be better if there will be at least 0.1 ms between two `yield`s. Otherwise, the time for switching and controlling will be spent more resources, and the execution of the task will be slowed down many times.

Now you can run `longNonBlockingOperation` and it will run in pseudo-parallel mode.

### await

```javascript
const task1 = longNonBlockingOperation();
const task2 = await longNonBlockingOperation();
```

Parallelized function returns a Promise, which will be resolved when the task is completed.

### `abort`

You can stop the task at any time:

```javascript
task.abort(resolve);
```

It will stop the task, the promise will be resolved or rejected depending on the `resolve` parameter (`true` by default). The value in the handler will be the `Aborted` symbol:

```javascript
import { Aborted, isAborted } from 'thread-like';
...
try {
  const task = await runTask();
} catch (e) {
  if (!isAborted(e)) { // Или e !== Aborted
    // Abort handling
  }
}
```

## Helpers

### Yield every n iterations

Allows to stop execution not every time, but every `n` iterations.

```javascript
import { parallelize, everyNth } from 'thread-like';
...
const p = parallelize(function* () {
  let count = 0;
  while (true) {
    count++;
    yield* everyNth(count, 100);
  }
});
```
