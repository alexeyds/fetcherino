import jutest from "jutest";
import { parseQuery } from "utils/url";

jutest("URL utils", function(t) {
  t.describe("parseQuery()", function(t) {
    t.test("returns url and empty object", function(t) {
      let [url, query] = parseQuery("/");
      t.equal(url, "/");
      t.same(query, {});
    });

    t.test("parses query", function(t) {
      let [url, query] = parseQuery("/test?foo=bar");
      t.equal(url, "/test");
      t.same(query, {foo: "bar"});
    });

    t.test("throws if query cant be parsed", function(t) {
      t.throws(() => parseQuery("/te?st?foo=bar"), /invalid/i);
    });
  });
});
