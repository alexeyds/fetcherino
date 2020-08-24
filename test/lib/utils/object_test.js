import test from "enhanced-tape";
import { isObject, isEqual } from "utils/object";

test("utils/object", function(t) {
  t.test("isObject()", function(t) {
    t.test("checks if value is an object", function(t) {
      t.equal(isObject({}), true);
      t.equal(isObject(1), false);
    });
  });

  t.test("isEqual", function(t) {
    t.test("compares objects", function(t) {
      t.equal(isEqual("foo", "foo"), true);
      t.equal(isEqual({a: 1}, {a: 1}), true);
      t.equal(isEqual([["a", 1]], [["a", 1]]), true);
      t.equal(isEqual({a: 1, b: 2}, {a: 1}), false);
    });
  });
});
