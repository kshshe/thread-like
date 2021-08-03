export function* everyNth(value: number, n: number) {
  if (value % n === 0) {
    yield;
  }
}
