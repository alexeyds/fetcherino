import { inspect } from "util";
import { isEmpty, omit, pick, mapObject } from "utils/object";

export function inspectRequestDetails({method, url, body, query}) {
  let result = `${method} ${url}`;

  let additionalDetails = {};
  if (isBodyPresent(body)) additionalDetails.body = inspect(body);
  if (isQueryPresent(query)) additionalDetails.query = inspect(query);

  return result + inspectAdditionalDetails(additionalDetails);
}

export function inspectExpectationDetails({method, url, ...additionalDetails}) {
  return `${method} ${url}` + inspectAdditionalDetails(additionalDetails);
}

export function inspectRequestWithExpectation(details, expectation) {
  let additionalKeys = Object.keys(omit(expectation, ['method', 'url', 'body', 'query']));
  let additionaRequestDetails = mapObject(
    pick(details, additionalKeys),
    (k, v) => [k, inspect(v)]
  );

  return [
    inspectRequestDetails(details) + inspectAdditionalDetails(additionaRequestDetails),
    inspectExpectationDetails(expectation)
  ];
}


function inspectAdditionalDetails(additionalDetails) {
  let entries = Object.entries(additionalDetails);

  if (entries.length > 0) {
    return ', ' + entries.map(([k ,v]) => `${k}: ${v}`).join(", ");
  } else {
    return '';
  }
}

function isBodyPresent(body) {
  return body !== undefined && body !== '';
}

function isQueryPresent(query) {
  return !isEmpty(query);
}
