export function isBlob(body) {
  return isConstructorNameEqual(body, "Blob");
}

export function isArrayBuffer(body) {
  return body instanceof ArrayBuffer;
}

export function isArrayBufferView(body) {
  return ArrayBuffer.isView(body);
}

export function isFormData(body) {
  return isConstructorNameEqual(body, "FormData");
}

export function isURLSearchParams(body) {
  return body instanceof URLSearchParams;
}

export function isString(body) {
  return typeof body === 'string';
}

function isConstructorNameEqual(object, name) {
  return boolean(object) && object.constructor.name === name;
}

function boolean(body) {
  return !!body;
}
