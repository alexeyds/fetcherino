import { inspect } from "util";
import { isSubset } from "utils/iterable";
import { isEqual } from "utils/object";
import { createMatcher } from "matcher";

export { createMatcher };

export function objectIncluding(subset) {
  return createMatcher(
    source => isSubset(source, subset),
    `(object including ${inspect(subset)})`
  );
}

export function equalTo(object) {
  return createMatcher(
    source => isEqual(source, object),
    inspect(object)
  );
}

export function arrayIncludingSubset(subset) {
  return createMatcher(
    array => array.some(s => isSubset(s, subset)),
    `(array including superset of ${inspect(subset)})`
  );
}

export function arrayIncluding(object) {
  return createMatcher(
    array => array.some(s => isEqual(s, object)),
    `(array including ${inspect(object)})`
  );
}
