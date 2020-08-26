import { mapObject } from "utils/object";
import { createMatcher, inspectMatcher } from "mock/matcher_utils";
import { parseQuery } from "utils/url";
import { formToObject } from "utils/form";

export default class ExpectedRequest {
  constructor(url, matchers={}) {
    validateMatchers(matchers);

    this._matchers = mapObject({...matchers, url}, (k, v) => [k, createMatcher(v)]);
  }

  matches({request, body}) {
    let [url, query] = parseQuery(request.url);
    let extractedAttributes = {
      body,
      url,
      query,
      headers: formToObject(request.headers)
    };

    return Object.entries(this._matchers).every(([name, matcher]) => {
      let value = (name in extractedAttributes) ? extractedAttributes[name] : request[name];
      return matcher(value);
    });
  }

  details() {
    return mapObject(this._matchers, (k, v) => [k, inspectMatcher(v)]);
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
