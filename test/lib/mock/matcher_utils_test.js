import test from "enhanced-tape";
import { createMatcher, inspectMatcher } from "mock/matcher_utils";

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

  t.test("inspectMatcher()", function(t) {
    t.test("extracts matcher details", function(t) {
      let matcher = createMatcher({a: 1});

      t.match(inspectMatcher(matcher), /including/);
    });

    t.test("works with undefined values", function(t) {
      t.equal(inspectMatcher(undefined), "undefined");
    });

    t.test("inspects non-function values", function(t) {
      t.equal(inspectMatcher(123), '123');
    });

    t.test("converts non-matcher functions to string", function(t) {
      t.match(inspectMatcher(() => 1), /1/);
    });
  });
});
