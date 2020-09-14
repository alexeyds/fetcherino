import { parseQuery } from "utils/url";

const REQUEST_DATA_KEYS = [
  "cache",
  "credentials",
  "integrity",
  "method",
  "mode",
  "redirect",
  "referrer",
  "destination",
  "referrerPolicy"
];

export default function parseRequest({request, body}) {
  let [url, query] = parseQuery(request.url);

  let result = {
    url,
    query,
    body,
    headers: Object.fromEntries(request.headers.entries())
  };

  REQUEST_DATA_KEYS.forEach(key => result[key] = request[key]);

  return result;
}
