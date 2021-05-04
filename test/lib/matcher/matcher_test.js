import jutest from "jutest";
import { createMatcher, inspectMatcher } from "matcher";

jutest("matcher", function(t) {
  t.describe("createMatcher()", function(t) {
    t.test("returns given function", function(t) {
      let matcherFunc = () => 'test';
      let matcher = createMatcher(matcherFunc, 'test');

      t.equal(matcher, matcherFunc);
    });
  });

  t.describe("inspectMatcher()", function(t) {
    t.test("returns matcher description", function(t) {
      let matcher = createMatcher(() => {}, 'hello');
      t.equal(inspectMatcher(matcher), 'hello');
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
