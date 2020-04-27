import test from "enhanced-tape";
import { buildExpectedRequest } from "server/expected_request";

test("Expected Request", function(t) {
  t.test("basic usage", function(t) {
    t.test("behaves like fetch Request", function(t) {
      let request = buildExpectedRequest("/test");

      t.equal(request.method, "GET");
      t.equal(request.body, null);
    
      t.end();
    });
  });

  t.test("url", function(t) {
    t.test("sets url", function(t) {
      let request = buildExpectedRequest("/test");

      t.equal(request.url, "/test");
    
      t.end();
    });
  });

  t.test("{method} option", function(t) {
    t.test("sets request.method", function(t) {
      let request = buildExpectedRequest("/test", {method: "POST"});

      t.equal(request.method, "POST");
    
      t.end();
    });
  });

  t.test("{requestBody} option", function(t) {
    t.test("sets request.body", function(t) {
      let request = buildExpectedRequest("/test", { requestBody: "foo", method: "POST" });

      t.equal(request.body.toString(), "foo");
    
      t.end();
    });
  });

  t.test("{requestHeaders} option", function(t) {
    t.test("sets request.headers", function(t) {
      let request = buildExpectedRequest("/test", { requestHeaders: { 'Content-Type': "text/html" } });

      t.equal(request.headers.get("Content-Type"), "text/html");
  
      t.end();
    });
  });
});