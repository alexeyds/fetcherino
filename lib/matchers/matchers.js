import { isSubset } from "utils/iterable";
import { inspect } from "util";
import { isEqual } from "utils/object";

export function objectIncluding(subset) {
  let matcher = source => isSubset(source, subset);
  matcher.matcherDescription = `Object including ${inspect(subset)}`;
  return matcher;
}

export function equalTo(object) {
  let matcher = source => isEqual(source, object);
  matcher.matcherDescription = inspect(object);
  return matcher;
}

export function arrayIncludingSubset(subset) {
  let matcher = array => array.some(s => isSubset(s, subset));
  matcher.matcherDescription = `Array including subset ${inspect(subset)}`;
  return matcher;
}

export function arrayIncluding(object) {
  let matcher = array => array.some(s => isEqual(s, object));
  matcher.matcherDescription = `Array including ${inspect(object)}`;
  return matcher;
}