import test from "enhanced-tape";
import isA from "utils/is_a";

test("isA", function(t) {
  class Foo { }

  t.test("returns true if object's class name matches", function(t) {
    t.equal(isA(new Foo, "Foo"), true);
  });

  t.test("returns false if object's class doesnt match", function(t) {
    t.equal(isA({}, "Foo"), false);
  });

  t.test("works with null and undefined", function(t) {
    t.equal(isA(null, "Foo"), false);
    t.equal(isA(undefined, "Foo"), false);
  });
});
