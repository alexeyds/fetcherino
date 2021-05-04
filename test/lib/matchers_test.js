import jutest from "jutest";
import { objectIncluding, equalTo, arrayIncludingSubset, arrayIncluding } from "matchers";

jutest("matchers", function(t) {
  t.describe("objectIncluding()", function(t) {
    t.test("matches inclusion", function(t) {
      let matcher = objectIncluding({a: 1});

      t.assert(matcher({a: 1, b: 2}));
      t.refute(matcher({a: 3}));
    });
  });

  t.describe("equalTo()", function(t) {
    t.test("matches equality", function(t) {
      let matcher = equalTo({a: 1});

      t.assert(matcher({a: 1}));
      t.refute(matcher({a: 1, b: 2}));
    });
  });

  t.describe("arrayIncludingSubset()", function(t) {
    t.test("matches subset in array", function(t) {
      let matcher = arrayIncludingSubset({a: 1});

      t.assert(matcher([{b: 2}, {a: 1, c: 3}]));
      t.refute(matcher([{a: 2}]));
    });
  });

  t.describe("arrayIncluding()", function(t) {
    t.test("matches array", function(t) {
      let matcher = arrayIncluding({a: 1});

      t.assert(matcher([1, 2, {a: 1}]));
      t.refute(matcher([{a: 1, b: 2}]));
    });
  });
});
