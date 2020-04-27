import test from "enhanced-tape";
import { buildResponse } from "server/response";

test("buildResponse", function(t) {
  t.test("basic usage", function(t) {
    t.test("behaves like fetch Response", async function(t) {
      let response = buildResponse();

      t.equal(response.status, 200);
      t.equal(await response.text(), "");
  
      t.end();
    });
  });

  t.test("url", function(t) {
    t.test("sets response.url", function(t) {
      let response = buildResponse("/test");

      t.equal(response.url, "/test");
  
      t.end();
    });
  });

  t.test("{responseBody}", function(t) {
    t.test("sets response.body", async function(t) {
      let response = buildResponse("/test", { responseBody: "foo" });

      t.equal(await response.text(), "foo");
  
      t.end();
    });
  });

  t.test("{status}", function(t) {
    t.test("sets response.status", function(t) {
      let response = buildResponse("/test", { status: 400 });

      t.equal(response.status, 400);
  
      t.end();
    });
  });

  t.test("{responseHeaders}", function(t) {
    t.test("sets response.headers", function(t) {
      let response = buildResponse("/test", { responseHeaders: { 'Content-Type': "text/html" } });

      t.equal(response.headers.get("Content-Type"), "text/html");
  
      t.end();
    });
  });
});