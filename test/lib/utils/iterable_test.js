import test from "enhanced-tape";
import { isSubset } from "utils/iterable";

test("utils/iterable", function(t) {
  t.test("isSubset", function(t) {
    t.test("performs subset check", function(t) {
      t.equal(isSubset([{a: 1, b: 2}, {b: 2}], [{a: 1}]), true);
      t.equal(isSubset({a: [1, 2], b: 2}, {a: [1]}), true);
      t.equal(isSubset({a: 1}, {a: 2}), false);
    });
  });
});
