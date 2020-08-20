import test from "enhanced-tape";
import Headers, { isHeaders } from "fetch_api/headers";

test("Headers", function(t) {
  t.setup(() => {
    return { headers: new Headers() };
  });

  t.test("constructor", function(t) {
    t.test("populates headers from provided object", function(t) {
      let headers = new Headers({foo: "bar"});

      t.same(Array.from(headers), [["foo", "bar"]]);
    });

    t.test("populates headers from existing Headers", function(t) {
      let headers = new Headers(new Headers({foo: "bar"}));

      t.same(Array.from(headers), [["foo", "bar"]]);
    });

    t.test("populates headers from array", function(t) {
      let headers = new Headers(new Headers([["foo", "bar"]]));

      t.same(Array.from(headers), [["foo", "bar"]]);
    });
  });

  t.test("#get", function(t) {
    t.test("returns null by default", function(t, {headers}) {
      t.equal(headers.get("foo"), null);
    });

    t.test("joins all appended headers", function(t, {headers}) {
      headers.append("foo", "bar");
      headers.append("foo", "baz");
      t.equal(headers.get("foo"), "bar, baz");
    });
  });

  t.test("delegated methods", function(t) {
    t.test("#append", function(t, {headers}) {
      headers.append("foo", "bar");

      t.same(headers.get("foo"), "bar");
    });

    t.test("#has", function(t, {headers}) {
      headers.append("foo", "bar");

      t.equal(headers.has("bar"), false);
      t.equal(headers.has("foo"), true);
    });

    t.test("#delete", function(t, {headers}) {
      headers.append("foo", "bar");
      headers.delete("foo");

      t.equal(headers.get("foo"), null);
    });

    t.test("#set", function(t, {headers}) {
      headers.append("foo", "bar");
      headers.set("foo", "baz");

      t.equal(headers.get("foo"), "baz");
    });

    t.test("iterators", function(t, {headers}) {
      headers.append("foo", "bar");
      headers.append("foo", "baz");
      
      t.same(Array.from(headers.entries()), [["foo", "bar, baz"]]);
      t.same(Array.from(headers.values()), ["bar, baz"]);
      t.same(Array.from(headers.keys()), ["foo"]);
    });

    t.test("converts names of stored items to strings", function(t, {headers}) {
      t.throws(() => headers.append(Symbol.iterator, "test"), /Symbol/);
    });

    t.test("converts values of stored items to strings", function(t, {headers}) {
      headers.append("foo", undefined);

      t.equal(headers.get("foo"), "undefined");
    });

    t.test("converts header names to lower case", function(t, {headers}) {
      headers.append("COntEnt-TYPE", "text/html");

      t.equal(headers.get("CONtEnT-type"), "text/html");
    });
  });

  t.test("forEach", function(t) {
    t.test("executes given function for each headers", function(t) {
      let result = {};
      let headers = new Headers({foo: "bar"});

      headers.forEach((v, k) => result[k] = v);
      t.same(result, {foo: "bar"});
    });
  });

  t.test("other properties", function(t) {
    t.test("has Symbol.iterator property", function(t, {headers}) {
      headers.append("foo", "bar");

      let result = Array.from(headers);

      t.same(result, [["foo", "bar"]]);
    });

    t.test("has Symbol.toStringTag property", function(t, {headers}) {
      t.equal(headers.toString(), "[object Headers]");
    });
  });

  t.test("isHeaders()", function(t) {
    t.equal(isHeaders({}), false);
    t.equal(isHeaders(new Headers), true);
    t.equal(isHeaders(null), false);
  });
});
