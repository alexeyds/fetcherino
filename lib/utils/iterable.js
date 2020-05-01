export function iterableToObject(iterable) {
  let result = {};

  for (let [k, v] of iterable) {
    result[k] = v;
  }

  return result;
}