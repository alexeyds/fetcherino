import { inspect } from "util";
import { isSubset } from "utils/iterable";
import { isEqual } from "utils/object";
import { newMatcher } from "matcher";

export function objectIncluding(subset) {
  return newMatcher({
    matcherFunc: source => isSubset(source, subset),
    description: `(object including ${inspect(subset)})`
  });
}

export function equalTo(object) {
  return newMatcher({
    matcherFunc: source => isEqual(source, object),
    description: inspect(object)
  });
}

export function arrayIncludingSubset(subset) {
  return newMatcher({
    matcherFunc: array => array.some(s => isSubset(s, subset)),
    description: `(array including superset of ${inspect(subset)})`
  });
}

export function arrayIncluding(object) {
  return newMatcher({
    matcherFunc: array => array.some(s => isEqual(s, object)),
    description: `(array including ${inspect(object)})`
  });
}
