import { inspect } from "util";
import { isObject } from "utils/object";
import { objectIncluding, equalTo } from "matchers";

export function createMatcher(value) {
  if (typeof value === "function") {
    return value;
  } else if (isObject(value)) {
    return objectIncluding(value);
  } else {
    return equalTo(value);
  }
}

export function inspectMatcher(matcher) {
  if (typeof matcher === 'function') {
    return matcher.matcherDescription || matcher.toString();
  } else {
    return inspect(matcher);
  }
}
