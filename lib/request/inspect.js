import { parseRequestBody } from "request/body";
import { isFormDataType, isJSONType } from "headers/content_type";
import { inspect } from "util";

export function inspectRequest(request) {
  let result = `${request.method} ${request.url}`;

  let body = inspectRequestBody(request);
  if (body !== null) {
    result = result + " " + body;
  }

  return result;
}

function inspectRequestBody(request) {
  let body = parseRequestBody(request);

  if (body !== null) {
    let type = getBodyType(request);

    return inspect(body) + " " + `(${type})`;
  } else {
    return body;
  }
}

function getBodyType(request) {
  if (isJSONType(request.headers)) {
    return "JSON";
  } else if (isFormDataType(request.headers)) {
    return "form-data";
  } else {
    return "text";
  }
}