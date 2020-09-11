import test from "enhanced-tape";
import Request from "fetch_api/request";
import RequestDetails from "expected_request/request_details";

test("RequestDetails", function(t) {
  t.test("#get", function(t) {
    t.test("extracts request key", function(t) {
      let request = new Request("/test", {credentials: "omit"});
      let details = new RequestDetails({request});

      t.equal(details.get("url"), "/test");
      t.equal(details.get("credentials"), "omit");
    });

    t.test("extracts query from url", function(t) {
      let request = new Request("/test?foo=bar");
      let details = new RequestDetails({request});

      t.equal(details.get("url"), "/test");
      t.same(details.get("query"), {foo: "bar"});
    });

    t.test("parses headers", function(t) {
      let request = new Request("/test", { headers: {foo: "bar"} });
      let details = new RequestDetails({request});

      t.same(details.get("headers"), {foo: "bar"});
    });

    t.test("uses provided {body}", function(t) {
      let details = new RequestDetails({request: new Request("/"), body: "foo"});

      t.equal(details.get("body"), "foo");
    });
  });
});
