import jutest from "jutest";
import { isSubset } from "utils/iterable";

jutest("utils/iterable", function(t) {
  t.describe("isSubset", function(t) {
    t.test("performs subset check", function(t) {
      t.equal(isSubset([{a: 1, b: 2}, {b: 2}], [{a: 1}]), true);
      t.equal(isSubset({a: [1, 2], b: 2}, {a: [1]}), true);
      t.equal(isSubset({a: 1}, {a: 2}), false);
    });
  });
});
