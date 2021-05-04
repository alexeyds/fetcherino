import jutest from "jutest";
import createMatcherFor from "expected_request/create_matcher_for";

jutest("createMatcherFor", function(t) {
  t.test("returns function unchanged", function(t) {
    let func = () => true;
    t.equal(createMatcherFor(func), func);
  });

  t.test("returns partial matcher for objects", function(t) {
    let matcher = createMatcherFor({a: 1});

    t.assert(matcher({a: 1, b: 2}));
    t.refute(matcher({a: 2}));
  });

  t.test("returns equality matcher for everything else", function(t) {
    let matcher = createMatcherFor("foobar");

    t.assert(matcher("foobar"));
    t.refute(matcher("foo"));
  });
});
