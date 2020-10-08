import { inspect } from "util";

export function createMatcher(matcherFunc, description) {
  matcherFunc.__matcherDescription = description;
  return matcherFunc;
}

export function inspectMatcher(matcher) {
  if (typeof matcher === 'function') {
    return matcher.__matcherDescription || matcher.toString();
  } else {
    return inspect(matcher);
  }
}