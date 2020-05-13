import test from "enhanced-tape";
import { ContentTypes } from "headers/content_type";
import { buildFetch } from "fetcherino";

test("buildFetch", function(t) {
  t.test("fetch()", function(t) {
    t.test("throws on unmocked fetch attempt", function(t) {
      let fetch = buildFetch();

      t.throws(() => {
        fetch("/test");
      }, /mock/);

      t.end();
    });

    t.test("delegates request options", function(t) {
      let fetch = buildFetch();
      fetch.mock("/test", { requestMethod: "POST" });

      t.doesNotThrow(() => {
        fetch("/test", {method: "POST"});
      });
    
      t.end();
    });
  });

  t.test("fetch.mock()", function(t) {
    t.test("mocks empty response", async function(t) {
      let fetch = buildFetch();
      fetch.mock("/test");

      let r = await fetch("/test").then(r => r);

      t.equal(r.status, 200);
      t.equal(r.url, "/test");
      t.equal(await r.text(), "");
    
      t.end();
    });

    t.test("matches expected requests", function(t) {
      let fetch = buildFetch();
      fetch.mock("/test");

      t.throws(() => {
        fetch("/tests");
      }, /mock/);
    
      t.end();
    });

    t.test("supports response options", async function(t) {
      let fetch = buildFetch();
      fetch.mock("/test", { responseBody: "test", responseStatus: 400, responseHeaders: {"Content-Type": "text"} });

      let r = await fetch("/test");

      t.equal(await r.text(), "test");
      t.equal(r.status, 400);
      t.equal(r.headers.get("Content-Type"), "text");
    
      t.end();
    });

    t.test("supports {requestMethod} options", async function(t) {
      let fetch = buildFetch();
      fetch.mock("/test", { requestMethod: "POST" });

      t.throws(() => {
        fetch("/test");
      }, /mock/);
    
      t.end();
    });

    t.test("supports {requestBody} options", async function(t) {
      let fetch = buildFetch();
      fetch.mock("/test", { requestMethod: "POST", requestBody: "test" });

      t.throws(() => {
        fetch("/test", {method: "POST"});
      }, /mock/);
    
      t.end();
    });

    t.test("supports {requestHeaders} options", async function(t) {
      let fetch = buildFetch();
      fetch.mock("/test", { 
        requestMethod: "POST", 
        requestBody: JSON.stringify({a: 1, b: 2}), 
        requestHeaders: {"Content-Type": ContentTypes.JSON} 
      });

      t.doesNotThrow(() => {
        fetch("/test", {method: "POST", body: JSON.stringify({b: 2, a: 1}), headers: {"Content-Type": ContentTypes.JSON}});
      });
    
      t.end();
    });
  });

  t.test("fetch.ensureAllMocksConsumed()", function(t) {
    t.test("does nothing if there are no mocks", function(t) {
      let fetch = buildFetch();

      t.doesNotThrow(() => {
        fetch.ensureAllMocksConsumed();
      });
  
      t.end();
    });

    t.test("throws if there are unconsumed mocks", function(t) {
      let fetch = buildFetch();
      fetch.mock("/");

      t.throws(() => {
        fetch.ensureAllMocksConsumed();
      }, /mock/);
    
      t.end();
    });
  });

  t.test("fetch.mockJSON()", function(t) {
    t.test("delegates all options to fetch.mock()", async function(t) {
      let fetch = buildFetch();
      fetch.mockJSON("/", {requestMethod: "POST"});

      await fetch("/", {method: "POST"});
      t.pass();
    
      t.end();
    });

    t.test("adds JSON content-type to response", async function(t) {
      let fetch = buildFetch();
      fetch.mockJSON("/");

      let response = await fetch("/");

      t.equal(response.headers.get("Content-Type"), ContentTypes.JSON);
      t.equal(await response.text(), "");
    
      t.end();
    });

    t.test("merges JSON headers into {responseHeaders}", async function(t) {
      let fetch = buildFetch();
      fetch.mockJSON("/", {responseHeaders: {"Content-Type": "foo", "foo": "bar"}});

      let response = await fetch("/");

      t.equal(response.headers.get("Content-Type"), ContentTypes.JSON);
      t.equal(response.headers.get("foo"), "bar");
      t.equal(await response.text(), "");
    
      t.end();
    });

    t.test("stringifies {responseBody}", async function(t) {
      let fetch = buildFetch();
      fetch.mockJSON("/", {responseBody: {foo: "bar"}});

      let response = await fetch("/");

      t.same(await response.json(), {foo: "bar"});
    
      t.end();
    });

    let JSONHeaders = {"Content-Type": ContentTypes.JSON};

    t.test("creates JSON request expectation", async function(t) {
      let fetch = buildFetch();
      fetch.mockJSON("/", {requestBody: {a: 1}, requestMethod: "POST"});
    
      await fetch("/", {method: "POST", body: JSON.stringify({a: 1}), headers: JSONHeaders});
      t.pass();

      t.end();
    });
  });
});