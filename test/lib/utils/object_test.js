import test from "enhanced-tape";
import { isObject, isEqual, isEmpty, mapObject, countEntries } from "utils/object";

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

  t.test("mapObject", function(t) {
    t.test("maps object", function(t) {
      let result = mapObject({a: 1, b: 2}, (k, v) => [`new_${k}`, v+1]);

      t.same(result, {new_a: 2, new_b: 3});
    });

    t.test("does not mutate provided object", function(t) {
      let oldObj = {a: 1};
      mapObject(oldObj, () => [1, 2]);

      t.same(oldObj, {a: 1});
    });
  });

  t.test("countEntries", function(t) {
    t.test("returns object length", function(t) {
      t.equal(countEntries({}), 0);
      t.equal(countEntries({a: 1}), 1);
    });
  });
});
