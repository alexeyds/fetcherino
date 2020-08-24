import test from "enhanced-tape";
import Request from "fetch_api/request";
import ExpectedRequest from "mock/expected_request";

test("ExpectedRequest", function(t) {
  t.test("constructor", function(t) {
    t.test("throws if some option keys are invalid", function(t) {
      t.throws(() => new ExpectedRequest({foo: "bar"}), /matcher/);
    });
  });

  function buildRequest(opts) {
    return new Request("/", opts);
  }

  function matches({request, body}, params) {
    let expected = new ExpectedRequest(params);
    return expected.matches({request, body});
  }

  t.test("#matches", function(t) {
    t.test("returns true if no matchers are specified", function(t) {
      let request = buildRequest();
      t.true(matches({request}));
    });

    t.test("matches simple options", function(t) {
      let request = buildRequest({credentials: "include"});

      t.false(matches({request}, {credentials: "omit"}));
      t.true(matches({request}, {credentials: "include"}));
    });

    t.test("matches headers", function(t) {
      let request = buildRequest({headers: {foo: "bar", bar: "baz"}});

      t.false(matches({request}, {headers: {foo: "baz"}}));
      t.true(matches({request}, {headers: {foo: "bar"}}));
    });

    t.test("matches query", function(t) {
      let request = new Request("/test?foo[]=1&foo[]=2");

      t.false(matches({request}, {query: {foo: ['2', '3']}}));
      t.true(matches({request}, {query: {foo: ['1']}}));
    });
  });

  t.test("#matches with {body}", function(t) {
    t.setup(() => {
      return { request: buildRequest() };
    });

    t.test("matches request body", function(t, {request}) {
      t.false(matches({request, body: "foo"}, {body: "foobar"}));
      t.true(matches({request, body: "foo"}, {body: "foo"}));
    });

    t.test("supports function body matchers", function(t, {request}) {
      t.false(matches({request}, {body: () => false}));
      t.true(matches({request, body: "foo"}, {body: (b) => b === "foo"}));
    });

    t.test("uses subset matcher by default if body is object", function(t, {request}) {
      t.false(matches({request, body: {a: 1}}, {body: {a: 2}}));
      t.true(matches({request, body: {a: 1, b: 2}}, {body: {a: 1}}));
    });
  });

  t.test("#details", function(t) {
    t.test("inspects simple matchers", function(t) {
      let expectation = new ExpectedRequest({credentials: "omit"});

      t.same(expectation.details(), {credentials: "omit"});
    });

    t.test("inspects function matchers", function(t) {
      let expectation = new ExpectedRequest({body: "foo", headers: {foo: "bar"}, query: {test: 1}});
      let details = expectation.details();

      t.match(details.body, /foo/);
      t.match(details.headers, /foo/);
      t.match(details.query, /test/);
    });
  });
});
