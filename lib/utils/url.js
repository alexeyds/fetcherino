import { formToObject } from "utils/form";

export function parseQuery(url) {
  if (url.indexOf("?") === -1) {
    return [url, {}];
  } else {
    let [base, query] = splitByQuery(url);
    query = formToObject(new URLSearchParams(query));

    return [base, query];
  }
}

function splitByQuery(url) {
  let split = url.split("?");
  if (split.length !== 2) {
    throw new TypeError(`Invalid url: ${url}`);
  }

  return split;
}