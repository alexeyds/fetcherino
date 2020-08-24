import { isObject } from "utils/object";
import { parseQuery } from "utils/url";
import { formToObject } from "utils/form";
import { inspect } from "util";
import { objectIncluding, equalTo } from "matchers";

export default class ExpectedRequest {
  constructor({body, headers, query, ...simpleMatchers}={}) {
    validateMatchers(simpleMatchers);

    this._bodyMatcher = createMatcher(body);
    this._headersMatcher = createMatcher(headers);
    this._queryMatcher = createMatcher(query);
    this._simpleMatchers = simpleMatchers;
  }

  matches({request, body}) {
    let headers = formToObject(request.headers);
    let [, query] = parseQuery(request.url);

    return everyOptionMatches(request, this._simpleMatchers) &&
           this._applyMatcher(this._bodyMatcher, body) &&
           this._applyMatcher(this._headersMatcher, headers) &&
           this._applyMatcher(this._queryMatcher, query);
  }

  inspect() {
    let details = { ...this._simpleMatchers };
    maybeAddMatcherDetails(details, "body", this._bodyMatcher);
    maybeAddMatcherDetails(details, "headers", this._headersMatcher);
    maybeAddMatcherDetails(details, "query", this._queryMatcher);
    return inspect(details);
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

function maybeAddMatcherDetails(details, name, matcher) {
  if (matcher) {
    details[name] = matcher.matcherDescription ? matcher.matcherDescription : matcher;
  }
}