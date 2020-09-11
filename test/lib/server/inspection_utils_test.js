import test from "enhanced-tape";
import Request from "fetch_api/request";
import ExpectedRequest from "expected_request";
import { requestDetails, inspectDetails } from "server/inspection_utils";

test("server/inspection_utils", function(t) {
  t.test("requestDetails", function(t) {
    t.test("returns method and url", function(t) {
      let details = requestDetails({request: new Request("/")});

      t.same(details, {url: "/", method: "GET"});
    });

    t.test("inspects {body}", function(t) {
      let details = requestDetails({request: new Request("/"), body: "foo"});

      t.equal(details.body, "'foo'");
    });

    t.test("extracts and inspects query", function(t) {
      let details = requestDetails({request: new Request("/foo?a=1")});

      t.equal(details.url, "/foo");
      t.equal(details.query, "{ a: '1' }");
    });

    t.test("includes {includeFields} into details", function(t) {
      let details = requestDetails({request: new Request("/"), includeFields: ["credentials"]});

      t.equal(details.credentials, "'same-origin'");
    });

    t.test("ignores {includeFields} that already are included in the details", function(t) {
      let request = new Request("/foo?a=1");
      let details = requestDetails({request, body: "foo", includeFields: ["query", "body"]});

      t.equal(details.query, "{ a: '1' }");
      t.equal(details.body, "'foo'");
    });

    t.test("converts headers to object", function(t) {
      let request = new Request("/", {headers: {foo: "bar"}});
      let details = requestDetails({request, includeFields: ["headers"]});

      t.equal(details.headers, "{ foo: 'bar' }");
    });
  });

  t.test("inspectDetails", function(t) {
    t.test("inspects basic request params", function(t) {
      let details = requestDetails({request: new Request("/")});

      t.equal(inspectDetails(details), "GET /");
    });

    t.test("inspects body", function(t) {
      let details = requestDetails({request: new Request("/", {method: "POST"}), body: "foo"});

      t.equal(inspectDetails(details), "POST / 'foo'");
    });

    t.test("inspects other details", function(t) {
      let details = requestDetails({request: new Request("/"), includeFields: ["credentials", "redirect"]});

      t.equal(inspectDetails(details), "GET /, credentials: 'same-origin', redirect: 'follow'");
    });

    t.test("can inspect ExpectedRequest#details", function(t) {
      let details = new ExpectedRequest("/foo", {body: {a: 1}, credentials: "include"}).details();

      t.match(inspectDetails(details), /a: 1/);
    });
  });
});
