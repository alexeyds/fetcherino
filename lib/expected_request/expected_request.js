import { mapObject } from "utils/object";
import { inspectMatcher } from "matcher";
import createMatcherFor from "expected_request/create_matcher_for";
import calculateSimilarityPercent from "expected_request/calculate_similarity_percent";
import parseRequest from "request_details/parse_request";

export default class ExpectedRequest {
  constructor(url, matchers={}) {
    validateUrl(url);
    validateMatchers(matchers);

    this._matchers = mapObject({...matchers, url}, (k, v) => [k, createMatcherFor(v)]);
  }

  matches({request, body}) {
    let requestDetails = parseRequest({request, body});

    return Object.entries(this._matchers).every(([name, matcher]) => {
      return matcher(requestDetails[name]);
    });
  }

  similarityPercent({request, body}) {
    let requestDetails = parseRequest({request, body});
    let matches = mapObject(this._matchers, (name, matcher) => [name, matcher(requestDetails[name])]);
    let weights = { url: 60 };

    return calculateSimilarityPercent(matches, weights);
  }

  details() {
    let details = mapObject(this._matchers, (k, v) => {
      let result = inspectMatcher(v);

      if (["method", "url"].includes(k)) result = unescape(result);

      return [k, result];
    });

    details.method = details.method || "ANY";

    return details;
  }
}

function validateUrl(url) {
  if (!url) {
    throw new TypeError(`You must provide a valid url to the request matcher`);
  }
}

function validateMatchers(matchers) {
  let validKeys = ["cache", "credentials", "mode", "redirect", "referrer", "method", "body", "headers", "query"];

  for (let key in matchers) {
    if (!validKeys.includes(key)) {
      throw new TypeError(`Request matcher "${key}" is not supported. Supported matchers are: ${validKeys.join(", ")}`);
    }
  }
}

function unescape(str) {
  return str.replace(/['"]/g, "");
}
