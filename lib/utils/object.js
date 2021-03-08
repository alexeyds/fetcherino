export { default as isObject } from "lodash.isobject";
export { default as isEqual } from "lodash.isequal";
export { default as isEmpty } from "lodash.isempty";
export { default as omit } from "lodash.omit";
export { default as pick } from "lodash.pick";

export function mapObject(object, mapper) {
  let result = {};

  for (let oldKey in object) {
    let [k, v] = mapper(oldKey, object[oldKey]);
    result[k] = v;
  }

  return result;
}

export function countEntries(object) {
  return Object.keys(object).length;
}

export function fromEntries(entries) {
  let result = {};

  for (let [k, v] of entries) {
    result[k] = v;
  }

  return result;
}