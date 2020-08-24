import test from "enhanced-tape";
import { isObject, isEqual, isEmpty } from "utils/object";

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

  t.test("isEmpty", function(t) {
    t.test("check if object is empty", function(t) {
      t.equal(isEmpty({a: undefined}), false);
      t.equal(isEmpty({}), true);
    });
  });
});
