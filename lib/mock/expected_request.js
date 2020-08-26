import { mapObject } from "utils/object";
import { createMatcher, inspectMatcher } from "mock/matcher_utils";
import RequestDetails from "mock/request_details";

export default class ExpectedRequest {
  constructor(url, matchers={}) {
    validateUrl(url);
    validateMatchers(matchers);

    this._matchers = mapObject({...matchers, url}, (k, v) => [k, createMatcher(v)]);
  }

  matches({request, body}) {
    let details = new RequestDetails({request, body});

    return Object.entries(this._matchers).every(([name, matcher]) => {
      return matcher(details.get(name));
    });
  }

  details() {
    return mapObject(this._matchers, (k, v) => [k, inspectMatcher(v)]);
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
