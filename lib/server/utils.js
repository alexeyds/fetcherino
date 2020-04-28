import { default as lodashIsEqual } from "lodash.isequal";
import { inspect } from "util";

export function getRequestBody(request) {
  let parseBody = (body) => {
    if (request.headers.get('Content-Type') === "application/json") {
      return JSON.parse(body);
    } else {
      return body;
    }
  };

  return request.body && parseBody(request.body.toString());
}

export function compareRequests(request_1, request_2) {
  let isEqual = 
    request_1.url === request_2.url && 
    request_1.method === request_2.method && 
    lodashIsEqual(getRequestBody(request_1), getRequestBody(request_2));

  return {isEqual};
}

export function inspectRequest(request) {
  let { method, url } = request;
  let body = getRequestBody(request);

  let result = `${method} ${url}`;

  if (body) {
    result = result + " " + inspect(body);
  }
  
  return result;
}