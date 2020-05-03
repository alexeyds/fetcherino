import { objectToHeaders } from "headers/helpers";

let ContentTypes = {
  JSON: "application/json",
  text: "text/plain",
  formData: "multipart/form-data"
};

export { ContentTypes };

export function isTextType(content) {
  return typeMatches(content, /text\/plain/);
}

export function isJSONType(content) {
  return typeMatches(content, /application\/json/);
}

export function isFormDataType(content) {
  return typeMatches(content, /multipart\/form-data/);
}

function typeMatches(headers, matcher) {
  let type = getType(headers);
  return type && !!type.match(matcher);
}

function getType(headersLike) {
  return objectToHeaders(headersLike).get("Content-Type");
}