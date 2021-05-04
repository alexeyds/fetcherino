import jutest from "jutest";
import Request from "fetch_api/request";
import parseRequest from "request_details/parse_request";

jutest("parseRequest", function(t) {
  t.test("extracts regular request details into plain object", function(t) {
    let request = new Request('/', {credentials: "omit"});
    let result = parseRequest({request});

    t.equal(result.credentials, "omit");
    t.equal(result.cache, "default");
    t.equal(result.url, '/');
    t.same(result.query, {});
  });

  t.test("extracts url and query", function(t) {
    let request = new Request('/test?foo=bar');
    let result = parseRequest({request});

    t.equal(result.url, '/test');
    t.same(result.query, {foo: 'bar'});
  });

  t.test("parses headers", function(t) {
    let request = new Request("/test", { headers: {foo: "bar"} });
    let result = parseRequest({request});

    t.same(result.headers, {foo: "bar"});
  });

  t.test("uses provided {body}", function(t) {
    let request = new Request("/");
    let result = parseRequest({request, body: "foo"});

    t.equal(result.body, "foo");
  });
});
