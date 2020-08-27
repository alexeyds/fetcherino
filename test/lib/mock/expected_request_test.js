import test from "enhanced-tape";
import Request from "fetch_api/request";
import ExpectedRequest from "mock/expected_request";

test("ExpectedRequest", function(t) {
  t.test("constructor", function(t) {
    t.test("throws if some option keys are invalid", function(t) {
      t.throws(() => new ExpectedRequest("/", {foo: "bar"}), /matcher/);
    });

    t.test("throws url is not provided", function(t) {
      t.throws(() => new ExpectedRequest(""), /url/);
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

    t.test("uses RequestDetails", function(t) {
      let request = rootRequest();

      t.false(rootExpectation({body: "foobar"}).matches({request, body: "foo"}));
      t.true(rootExpectation({body: "foo"}).matches({request, body: "foo"}));
    });
  });

  t.test("#similarityPercent", function(t) {
    t.test("is 0 if requests dont match", function(t) {
      let expectation = new ExpectedRequest("/test");
      let request = new Request("/");

      t.equal(expectation.similarityPercent({request}), 0);
    });

    t.test("is non-0 if requests match partially", function(t) {
      let expectation = new ExpectedRequest("/tests", { method: "GET" });
      let request = new Request("/test");

      t.true(expectation.similarityPercent({request}) > 0);
      t.true(expectation.similarityPercent({request}) < 100);
    });

    t.test("matches body", function(t) {
      let expectation = new ExpectedRequest("/tests", { method: "POST", body: "foo" });
      let request = new Request("/test");

      t.equal(expectation.similarityPercent({request}), 0);
    });

    t.test("assigns higher weight to matching url", function(t) {
      let expectation = new ExpectedRequest("/test", {method: "GET"});
      let testSimilarity = expectation.similarityPercent({request: new Request("/test", {method: "POST"})});
      let rootSimilarity = expectation.similarityPercent({request: new Request("/")});

      t.true(testSimilarity > rootSimilarity);
    });
  });

  t.test("#details", function(t) {
    t.test("inspects matchers", function(t) {
      let details = new ExpectedRequest("/", {
        body: "foo",
        headers: {foo: "bar"},
        query: {test: 1}
      }).details();

      t.match(details.body, /foo/);
      t.match(details.headers, /foo/);
      t.match(details.query, /test/);
    });
  });
});
