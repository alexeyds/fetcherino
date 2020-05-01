export { default as isObject } from "lodash.isobject";

export function hasMethod(object, method) {
  return typeof object[method] === "function";
}