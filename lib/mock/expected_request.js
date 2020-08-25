import { isObject } from "utils/object";
import { parseQuery } from "utils/url";
import { formToObject } from "utils/form";
import { objectIncluding, equalTo } from "matchers";

export default class ExpectedRequest {
  constructor(url, {body, headers, query, ...simpleMatchers}={}) {
    validateMatchers(simpleMatchers);

    this._bodyMatcher = createMatcher(body);
    this._headersMatcher = createMatcher(headers);
    this._queryMatcher = createMatcher(query);
    this._urlMatcher = createMatcher(url);
    this._simpleMatchers = simpleMatchers;
  }

  matches({request, body}) {
    let headers = formToObject(request.headers);
    let [url, query] = parseQuery(request.url);

    return everyOptionMatches(request, this._simpleMatchers) &&
           this._applyMatcher(this._bodyMatcher, body) &&
           this._applyMatcher(this._headersMatcher, headers) &&
           this._applyMatcher(this._queryMatcher, query) &&
           this._applyMatcher(this._urlMatcher, url);
  }

  details() {
    let details = { ...this._simpleMatchers };
    let getDescription = matcher => matcher.matcherDescription || matcher;

    if (this._bodyMatcher) details.body = getDescription(this._bodyMatcher);
    if (this._headersMatcher) details.headers = getDescription(this._headersMatcher);
    if (this._queryMatcher) details.query = getDescription(this._queryMatcher);

    return details;
  }

  _applyMatcher(matcher, body) {
    if (matcher) {
      return matcher(body);
    } else {
      return true;
    }
  }
}

function validateMatchers(matchers) {
  let validKeys = ["cache", "credentials", "mode", "redirect", "referrer", "method"];

  for (let key in matchers) {
    if (!validKeys.includes(key)) {
      throw new TypeError(`Request matcher "${key}" is not supported. Supported matchers are: ${validKeys.join(", ")}`);
    }
  }
}

function createMatcher(target) {
  if (target === undefined) {
    return undefined;
  } else if (typeof target === "function") {
    return target;
  } else if (isObject(target)) {
    return objectIncluding(target);
  } else {
    return equalTo(target);
  }
}

function everyOptionMatches(request, options) {
  let result = true;

  for (let option in options) {
    let value = options[option];
    result = request[option] === value;

    if (!result) break;
  }

  return result;
}
