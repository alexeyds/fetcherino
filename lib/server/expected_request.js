import { Request } from "node-fetch";

export function buildExpectedRequest(url, opts={}) {
  let { method, requestBody, requestHeaders } = opts;

  return new Request(url, { method, body: requestBody, headers: requestHeaders });
}