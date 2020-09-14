import test from "enhanced-tape";
import { inspectRequestDetails, inspectExpectationDetails, inspectRequestWithExpectation } from "request_details/inspect";

test("request_details/inspect", function(t) {
  t.test("inspectRequestDetails", function(t) {
    t.test("inspects url and path", function(t) {
      let result = inspectRequestDetails({method: "GET", url: '/test'});
      t.equal(result, "GET /test");
    });

    t.test("adds body to result", function(t) {
      let result = inspectRequestDetails({method: "POST", url: '/test', body: "foo"});
      t.equal(result, "POST /test, body: 'foo'");
    });

    t.test("adds query to result", function(t) {
      let result = inspectRequestDetails({method: "GET", url: "/test", query: {a: 1}});
      t.equal(result, "GET /test, query: { a: 1 }");
    });

    t.test("ignores empty queries", function(t) {
      let result = inspectRequestDetails({method: "GET", url: "/test", query: {}});
      t.equal(result, "GET /test");
    });

    t.test("ignores any additional details", function(t) {
      let result = inspectRequestDetails({method: "GET", url: "/test", foo: "bar"});
      t.equal(result, "GET /test");
    });
  });

  t.test("inspectExpectationDetails", function(t) {
    t.test("inspects url and path", function(t) {
      let result = inspectExpectationDetails({method: "GET", url: '/test'});
      t.equal(result, "GET /test");
    });

    t.test("inspects all other proivded details", function(t) {
      let result = inspectExpectationDetails({method: "GET", url: '/test', query: "'foo' => bar", foo: "bar"});
      t.equal(result, "GET /test, query: 'foo' => bar, foo: bar");
    });
  });

  t.test("inspectRequestWithExpectation", function(t) {
    t.test("inspects both request details and expectation", function(t) {
      let request = {method: "POST", url: '/test'};
      let expectation = {method: "GET", url: '/test'};
      let result = inspectRequestWithExpectation(request, expectation);

      t.equal(result[0], 'POST /test');
      t.equal(result[1], 'GET /test');
    });

    t.test("adds all additional expectation details to request", function(t) {
      let request = {method: "POST", url: '/test', foo: 'baz'};
      let expectation = {method: "GET", url: '/test', foo: 'bar'};
      let result = inspectRequestWithExpectation(request, expectation);

      t.equal(result[0], "POST /test, foo: 'baz'");
      t.equal(result[1], 'GET /test, foo: bar');
    });
  });
});
