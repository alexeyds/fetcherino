import test from "enhanced-tape";
import Request from "fetch_api/request";
import ExpectedRequest from "mock/expected_request";

test("ExpectedRequest", function(t) {
  t.test("constructor", function(t) {
    t.test("throws if some option keys are invalid", function(t) {
      t.throws(() => new ExpectedRequest("/", {foo: "bar"}), /matcher/);
    });
  });

  function rootExpectation(opts) {
    return new ExpectedRequest("/", opts);
  }

  function rootRequest(opts) {
    return new Request("/", opts);
  }

  t.test("#matches", function(t) {
    t.test("matches url", function(t) {
      let request = new Request("/test");

      t.true(new ExpectedRequest("/test").matches({request}));
      t.false(new ExpectedRequest("/foo").matches({request}));
    });

    t.test("matches simple options", function(t) {
      let request = rootRequest({credentials: "include"});

      t.false(rootExpectation({credentials: "omit"}).matches({request}));
      t.true(rootExpectation({credentials: "include"}).matches({request}));
    });

    t.test("matches headers", function(t) {
      let request = rootRequest({headers: {foo: "bar", bar: "baz"}});

      t.false(rootExpectation({headers: {foo: "baz"}}).matches({request}));
      t.true(rootExpectation({headers: {foo: "bar"}}).matches({request}));
    });

    t.test("matches query", function(t) {
      let request = new Request("/test?foo[]=1&foo[]=2");

      t.false(new ExpectedRequest("/test", {query: {foo: ['2', '3']}}).matches({request}));
      t.true(new ExpectedRequest("/test", {query: {foo: ['1']}}).matches({request}));
    });
  });

  t.test("#matches with {body}", function(t) {
    t.setup(() => {
      return { request: rootRequest() };
    });

    t.test("matches request body", function(t, {request}) {
      t.false(rootExpectation({body: "foobar"}).matches({request, body: "foo"}));
      t.true(rootExpectation({body: "foo"}).matches({request, body: "foo"}));
    });

    t.test("supports function body matchers", function(t, {request}) {
      t.false(rootExpectation({body: () => false}).matches({request}));
      t.true(rootExpectation({body: (b) => b === "foo"}).matches({request, body: "foo"}));
    });

    t.test("uses subset matcher by default if body is an object", function(t, {request}) {
      t.false(rootExpectation({body: {a: 2}}).matches({request, body: {a: 1}}));
      t.true(rootExpectation({body: {a: 1}}).matches({request, body: {a: 1, b: 2}}));
    });
  });

  t.test("#details", function(t) {
    t.test("inspects simple matchers", function(t) {
      let expectation = new ExpectedRequest("/", {credentials: "omit"});

      t.same(expectation.details(), {credentials: "omit"});
    });

    t.test("inspects function matchers", function(t) {
      let expectation = new ExpectedRequest("/", {body: "foo", headers: {foo: "bar"}, query: {test: 1}});
      let details = expectation.details();

      t.match(details.body, /foo/);
      t.match(details.headers, /foo/);
      t.match(details.query, /test/);
    });
  });
});
