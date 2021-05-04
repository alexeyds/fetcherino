import jutest from "jutest";
import Request from "fetch_api/request";
import ExpectedRequest from "expected_request";

jutest("ExpectedRequest", function(t) {
  t.describe("constructor", function(t) {
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

  t.describe("#matches", function(t) {
    t.test("matches url", function(t) {
      let request = new Request("/test");

      t.assert(new ExpectedRequest("/test").matches({request}));
      t.refute(new ExpectedRequest("/foo").matches({request}));
    });

    t.test("matches simple options", function(t) {
      let request = rootRequest({credentials: "include"});

      t.refute(rootExpectation({credentials: "omit"}).matches({request}));
      t.assert(rootExpectation({credentials: "include"}).matches({request}));
    });

    t.test("uses RequestDetails", function(t) {
      let request = rootRequest();

      t.refute(rootExpectation({body: "foobar"}).matches({request, body: "foo"}));
      t.assert(rootExpectation({body: "foo"}).matches({request, body: "foo"}));
    });
  });

  t.describe("#similarityPercent", function(t) {
    t.test("is 0 if requests dont match", function(t) {
      let expectation = new ExpectedRequest("/test");
      let request = new Request("/");

      t.equal(expectation.similarityPercent({request}), 0);
    });

    t.test("is non-0 if requests match partially", function(t) {
      let expectation = new ExpectedRequest("/tests", { method: "GET" });
      let request = new Request("/test");

      t.assert(expectation.similarityPercent({request}) > 0);
      t.assert(expectation.similarityPercent({request}) < 100);
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

      t.assert(testSimilarity > rootSimilarity);
    });
  });

  t.describe("#details", function(t) {
    t.test("inspects matchers", function(t) {
      let details = new ExpectedRequest("/", {
        method: "POST",
        body: "foo",
        headers: {foo: "bar"},
        query: {test: 1}
      }).details();

      t.equal(details.url, "/");
      t.equal(details.method, "POST");
      t.match(details.body, /foo/);
      t.match(details.headers, /foo/);
      t.match(details.query, /test/);
    });

    t.test("sets method to (ANY) by default", function(t) {
      let details = new ExpectedRequest("/").details();

      t.match(details.method, /any/i);
    });
  });
});
