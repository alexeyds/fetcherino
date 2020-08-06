export function isText(contentType) {
  return contentType.startsWith("text/plain");
}

export function isJSON(contentType) {
  return contentType.startsWith("application/json");
}

export function isFormData(contentType) {
  return contentType.startsWith("multipart/form-data");
}

export function isFormURLEncoded(contentType) {
  return contentType.startsWith("application/x-www-form-urlencoded");
}
