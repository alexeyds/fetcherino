import test from "enhanced-tape";
import { objectIncluding, equalTo, arrayIncludingSubset, arrayIncluding } from "matchers";

test("matchers", function(t) {
  t.test("objectIncluding()", function(t) {
    t.test("matches inclusion", function(t) {
      let matcher = objectIncluding({a: 1});

      t.true(matcher({a: 1, b: 2}));
      t.false(matcher({a: 3}));
    });
  });

  t.test("equalTo()", function(t) {
    t.test("matches equality", function(t) {
      let matcher = equalTo({a: 1});

      t.true(matcher({a: 1}));
      t.false(matcher({a: 1, b: 2}));
    });
  });

  t.test("arrayIncludingSubset()", function(t) {
    t.test("matches subset in array", function(t) {
      let matcher = arrayIncludingSubset({a: 1});

      t.true(matcher([{b: 2}, {a: 1, c: 3}]));
      t.false(matcher([{a: 2}]));
    });
  });

  t.test("arrayIncluding()", function(t) {
    t.test("matches array", function(t) {
      let matcher = arrayIncluding({a: 1});

      t.true(matcher([1, 2, {a: 1}]));
      t.false(matcher([{a: 1, b: 2}]));
    });
  });
});
