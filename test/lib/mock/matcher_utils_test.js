import test from "enhanced-tape";
import { createMatcher } from "mock/matcher_utils";

test("mock/matcher_utils", function(t) {
  t.test("createMatcher()", function(t) {
    t.test("returns function unchanged", function(t) {
      let func = () => true;
      t.equal(createMatcher(func), func);
    });

    t.test("returns partial matcher for objects", function(t) {
      let matcher = createMatcher({a: 1});

      t.true(matcher({a: 1, b: 2}));
      t.false(matcher({a: 2}));
    });

    t.test("returns equality matcher for everything else", function(t) {
      let matcher = createMatcher("foobar");

      t.true(matcher("foobar"));
      t.false(matcher("foo"));
    });
  });
});
