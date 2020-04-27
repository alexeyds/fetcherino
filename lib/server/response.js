import { Response } from "node-fetch";

export function buildResponse(url, opts={}) {
  let { status, responseBody, responseHeaders } = opts;

  return new Response(responseBody, {url, status, headers: responseHeaders});
}