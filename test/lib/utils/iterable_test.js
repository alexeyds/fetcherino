import test from "enhanced-tape";
import { iterableToObject, isObject } from "utils/iterable";

test("utils/iterable", function(t) {
  t.test("iterableToObject()", function(t) {
    t.test("converts object-like iterables", function(t) {
      t.same(iterableToObject([["a", "b"]]), {a: "b"});
  
      t.end();
    });
  });


});