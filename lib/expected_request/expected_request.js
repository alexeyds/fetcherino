import isEqual from "lodash.isequal";
import { inspectRequest } from "request/inspect";
import { parseRequestBody } from "request/body";

export default class ExpectedRequest {
  constructor(request) {
    this._url = request.url;
    this._method = request.method;
    this._parsedBody = parseRequestBody(request);

    this._request = request;
  }

  isEqual(request) {
    return this._url === request.url && 
           this._method === request.method &&
           isEqual(this._parsedBody, parseRequestBody(request))
    ;
  }

  inspect() {
    return inspectRequest(this._request);
  }
}