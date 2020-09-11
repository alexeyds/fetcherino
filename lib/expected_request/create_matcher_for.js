import { isObject } from "utils/object";
import { objectIncluding, equalTo } from "matchers";

export default function createMatcherFor(value) {
  if (typeof value === "function") {
    return value;
  } else if (isObject(value)) {
    return objectIncluding(value);
  } else {
    return equalTo(value);
  }
}
