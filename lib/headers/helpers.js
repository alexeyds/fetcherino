import { Headers } from "node-fetch";
import { isObject } from "utils/object";
import { iterableToObject } from "utils/iterable";

export function isHeaders(object) {
  return isObject(object) && object.constructor.name === "Headers";
}

export function headersToObject(headers) {
  if (!isHeaders(headers)) {
    headers = new Headers(headers);
  }

  return iterableToObject(headers);
}

export function objectToHeaders(headersLike) {
  if (isHeaders(headersLike)) {
    return headersLike;
  } else {
    return new Headers(headersLike);
  }
}

export function mergeHeaders(headers_1, headers_2) {
  return new Headers({...headersToObject(headers_1), ...headersToObject(headers_2)});
}