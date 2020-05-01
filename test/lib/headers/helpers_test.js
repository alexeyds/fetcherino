import test from "enhanced-tape";
import { Headers } from "node-fetch";
import { isHeaders, headersToObject, mergeHeaders } from "headers/helpers";

test("headers/helpers", function(t) {
  t.test("isHeaders", function(t) {
    t.test("true if objects supports Headers interface", function(t) {
      t.true(isHeaders(new Headers()));
  
      t.end();
    });

    t.test("false if object doesn't support Headers interface", function(t) {
      t.false(isHeaders({}));  
    
      t.end();
    });

    t.test("doesn't throw for undefined or null", function(t) {
      t.equal(isHeaders(undefined), false);
      t.equal(isHeaders(null), false);
    
      t.end();
    });
  });

  t.test("headersToObject", function(t) {
    t.test("converts Headers to object", function(t) {
      let headers = new Headers({"Content-Type": "text/html"});

      t.same(headersToObject(headers), {"content-type": "text/html"});
  
      t.end();
    });

    t.test("works for headers-like objects", function(t) {
      let headers = {"Content-Type": "text/html"};

      t.same(headersToObject(headers), {"content-type": "text/html"});
    
      t.end();
    });
  });

  t.test("mergeHeaders()", function(t) {
    t.test("overwrites matching headers in first object", function(t) {
      let headers_1 = new Headers({"Content-Type": "text/html"});
      let headers_2 = new Headers({"Content-Type": "application/json"});
      let result = mergeHeaders(headers_1, headers_2);

      t.true(isHeaders(result));
      t.same(headersToObject(result), {"content-type": "application/json"});
  
      t.end();
    });

    t.test("preserves non-matching headers", function(t) {
      let headers_1 = new Headers({"Content-Type": "text/html"});
      let headers_2 = new Headers({"foo": "bar"});
      let result = mergeHeaders(headers_1, headers_2);

      t.same(headersToObject(result), {"content-type": "text/html", foo: "bar"});
    
      t.end();
    });

    t.test("can merge Headers and headers-like objects", function(t) {
      let headers_1 = new Headers({"Content-Type": "text/html"});
      let headers_2 = {"foo": "bar"};
      let result = mergeHeaders(headers_1, headers_2);

      t.same(headersToObject(result), {"content-type": "text/html", foo: "bar"});
    
      t.end();
    });
  });
});