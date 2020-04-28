import test from "enhanced-tape";
import { buildExpectedRequest, buildExpectedJSONRequest } from "server/expected_request";

test("Expected Request", function(t) {
  t.test("buildExpectedRequest()", function(t) {
    t.test("behaves like fetch Request", function(t) {
      let request = buildExpectedRequest("/test");

      t.equal(request.method, "GET");
      t.equal(request.body, null);
    
      t.end();
    });

    t.test("sets url", function(t) {
      let request = buildExpectedRequest("/test");

      t.equal(request.url, "/test");
    
      t.end();
    });

    t.test("{method} sets request.method", function(t) {
      let request = buildExpectedRequest("/test", {method: "POST"});

      t.equal(request.method, "POST");
    
      t.end();
    });

    t.test("{requestBody} sets request.body", function(t) {
      let request = buildExpectedRequest("/test", { requestBody: "foo", method: "POST" });

      t.equal(request.body.toString(), "foo");
    
      t.end();
    });

    t.test("{requestHeaders} sets request.headers", function(t) {
      let request = buildExpectedRequest("/test", { requestHeaders: { 'Content-Type': "text/html" } });

      t.equal(request.headers.get("Content-Type"), "text/html");
  
      t.end();
    });
  });

  t.test("buildExpectedJSONRequest", function(t) {
    t.test("delegates all options to buildExpectedRequest()", function(t) {
      let request = buildExpectedJSONRequest("/test", { method: "HEAD" });

      t.equal(request.method, "HEAD");
    
      t.end();
    });

    t.test("encodes body", function(t) {
      let request = buildExpectedJSONRequest("/test", { method: "POST", requestBody: {foo: "bar" }});

      t.equal(request.body.toString(), JSON.stringify({foo: "bar"}));
  
      t.end();
    });

    t.test("sets Content-Type header", function(t) {
      let request = buildExpectedJSONRequest("/test");

      t.equal(request.headers.get("Content-Type"), "application/json");
    
      t.end();
    });

    t.test("preserves other headers", function(t) {
      let request = buildExpectedJSONRequest("/test", { requestHeaders: { 'Content-Type': "text/html", "Test": "test" }});

      t.equal(request.headers.get("Test"), "test");
      t.equal(request.headers.get("Content-Type"), "application/json");

      t.end();
    });
  });
});