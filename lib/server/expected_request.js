import { Request } from "node-fetch";

export function buildExpectedRequest(url, opts={}) {
  let { method, requestBody, requestHeaders } = opts;

  return new Request(url, { method, body: requestBody, headers: requestHeaders });
}

export function buildExpectedJSONRequest(url, opts={}) {
  let requestHeaders = {...opts.requestHeaders, "Content-Type": "application/json"};
  let requestBody = JSON.stringify(opts.requestBody);

  opts = {...opts, requestBody, requestHeaders };
  return buildExpectedRequest(url, opts);
}