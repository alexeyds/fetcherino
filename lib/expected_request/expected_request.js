import { mapObject } from "utils/object";
import { inspectMatcher } from "matcher";
import createMatcherFor from "expected_request/create_matcher_for";
import calculateSimilarityPercent from "expected_request/calculate_similarity_percent";
import RequestDetails from "expected_request/request_details";

export default class ExpectedRequest {
  constructor(url, matchers={}) {
    validateUrl(url);
    validateMatchers(matchers);

    this._matchers = mapObject({...matchers, url}, (k, v) => [k, createMatcherFor(v)]);
  }

  matches({request, body}) {
    let details = new RequestDetails({request, body});

    return Object.entries(this._matchers).every(([name, matcher]) => {
      return matcher(details.get(name));
    });
  }

  similarityPercent({request, body}) {
    let details = new RequestDetails({request, body});
    let matches = mapObject(this._matchers, (name, matcher) => [name, matcher(details.get(name))]);
    let weights = { url: 60 };

    return calculateSimilarityPercent(matches, weights);
  }

  details() {
    let details = mapObject(this._matchers, (k, v) => [k, inspectMatcher(v)]);

    ["method", "url"].forEach(name => {
      if (details[name]) details[name] = unescape(details[name]);
    });

    if (!details.method) details.method = "ANY";

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
