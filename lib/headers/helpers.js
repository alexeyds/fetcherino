import { Headers } from "node-fetch";
import { hasMethod, isObject } from "utils/object";
import { iterableToObject } from "utils/iterable";

export function isHeaders(object) {
  return isObject(object) && hasMethod(object, "entries") && hasMethod(object, "append");
}

export function headersToObject(headers) {
  if (!isHeaders(headers)) {
    headers = new Headers(headers);
  }

  return iterableToObject(headers);
}

export function mergeHeaders(headers_1, headers_2) {
  return new Headers({...headersToObject(headers_1), ...headersToObject(headers_2)});
}