import test from "enhanced-tape";
import { Request } from "node-fetch";
import { compareRequests, getRequestBody } from "server/utils";

function buildJSONRequest(url, {body}) {
  let headers = {"Content-Type": "application/json"};
  return new Request(url, {method: "POST", body: JSON.stringify(body), headers});
}

test("Server utils", function(t) {
  t.test("getRequestBody", function(t) {
    t.test("returns null if request has no body", function(t) {
      t.equal(getRequestBody(new Request()), null);
  
      t.end();
    });

    t.test("returns text body", function(t) {
      let r = new Request("/test", {method: "POST", body: "foo"});

      t.equal(getRequestBody(r), "foo");
    
      t.end();
    });

    t.test("returns parsed json body if content-type header is json", function(t) {
      let r = buildJSONRequest("/test", {body: {foo: "bar"}});

      t.same(getRequestBody(r), {foo: "bar"});
    
      t.end();
    });
  });

  t.test("compareRequests()", function(t) {
    t.test("isEqual=true if requests are equal", function(t) {
      let { isEqual } = compareRequests(new Request(), new Request());

      t.true(isEqual);

      t.end();
    });

    t.test("isEqual=false if paths are different", function(t) {
      let { isEqual } = compareRequests(new Request("/test"), new Request("/test_me"));

      t.false(isEqual);
    
      t.end();
    });

    t.test("isEqual=false if methods are different", function(t) {
      let { isEqual } = compareRequests(new Request("/test", {method: "POST"}), new Request("/test"));

      t.false(isEqual);
    
      t.end();
    });

    t.test("isEqual=false if text bodies are different", function(t) {
      let r_1 = new Request("/test", {method: "POST", body: "foo"});
      let r_2 = new Request("/test", {method: "POST", body: "bar"});

      let { isEqual } = compareRequests(r_1, r_2);

      t.false(isEqual);
    
      t.end();
    });

    t.test("isEqual=false if text bodies are the same", function(t) {
      let r_1 = new Request("/test", {method: "POST", body: "foo"});
      let r_2 = new Request("/test", {method: "POST", body: "foo"});

      let { isEqual } = compareRequests(r_1, r_2);

      t.true(isEqual);
    
      t.end();
    });

    t.test("isEqual=true if JSON bodies are equal", function(t) {
      let r_1 = buildJSONRequest("/test", {body: {foo: "bar"}});
      let r_2 = buildJSONRequest("/test", {body: {foo: "bar"}});

      let { isEqual } = compareRequests(r_1, r_2);

      t.true(isEqual);
    
      t.end();
    });
  });
});