import { Headers } from "node-fetch";
import { isObject } from "utils/object";
import { iterableToObject } from "utils/iterable";

export function isHeaders(object) {
  return isObject(object) && object.constructor.name === "Headers";
}

export function headersLikeToObject(headersLike) {
  let headers = isHeaders(headersLike) ? headersLike : new Headers(headersLike);

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
  return new Headers({...headersLikeToObject(headers_1), ...headersLikeToObject(headers_2)});
}