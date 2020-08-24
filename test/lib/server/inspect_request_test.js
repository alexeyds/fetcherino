import test from "enhanced-tape";
import Request from "fetch_api/request";
import inspectRequest from "server/inspect_request";

test("inspectRequest()", function(t) {
  t.test("inspects simple requests", function(t) {
    let request = new Request("/foo");
    t.equal(inspectRequest(request), "GET /foo");
  });

  t.test("adds body if it is provided", function(t) {
    let request = new Request("/foo", {method: "POST"});
    t.match(inspectRequest(request, {body: {foo: "bar"}}), /bar/);
  });

  t.test("parses query", function(t) {
    let request = new Request("/foo?test=123");
    t.match(inspectRequest(request), /{ test: '123' }/);
  });

  t.test("inspects {includeAttributes}", function(t) {
    let request = new Request("/", {credentials: "include"});
    t.match(inspectRequest(request, {includeAttributes: ["credentials"]}), /include/);
  });

  t.test("ignores {includeAttributes} method", function(t) {
    let request = new Request("/");
    t.doesNotMatch(inspectRequest(request, {includeAttributes: ["method"]}), /method/);
  });

  t.test("parses headers", function(t) {
    let request = new Request("/", {headers: {"content-type": "application/json"}});
    t.match(inspectRequest(request, {includeAttributes: ["headers"]}), /json/);
  });
});
