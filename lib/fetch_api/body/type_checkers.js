import isA from "utils/is_a";

export function isBlob(body) {
  return isA(body, "Blob");
}

export function isArrayBuffer(body) {
  return body instanceof ArrayBuffer;
}

export function isArrayBufferView(body) {
  return ArrayBuffer.isView(body);
}

export function isFormData(body) {
  return isA(body, "FormData");
}

export function isURLSearchParams(body) {
  return body instanceof URLSearchParams;
}

export function isString(body) {
  return typeof body === 'string';
}
