import test from "enhanced-tape";
import { Headers } from "node-fetch";
import { isTextType, isJSONType, isFormDataType, ContentTypes } from "headers/content_type";

test("headers/content_type", function(t) {
  t.test("isTextType()", function(t) {
    t.test("false if content-type header is not present", function(t) {
      t.false(isTextType(new Headers()));
  
      t.end();
    });

    t.test("true if content-type is plain text", function(t) {
      t.true(isTextType(new Headers({"Content-Type": "text/plain;utf-8"})));
    
      t.end();
    });

    t.test("false if content-type is not text", function(t) {
      t.false(isTextType(new Headers({"Content-Type": "text/html"})));
  
      t.end();
    });

    t.test("supports headers-like objects", function(t) {
      t.true(isTextType({"Content-Type": "text/plain;utf-8"}));
    
      t.end();
    });
  });

  t.test("isJSONType()", function(t) {
    t.test("false if content-type is not JSON", function(t) {
      t.false(isJSONType({"Content-Type": "text/html"}));
  
      t.end();
    });

    t.test("true if content-type is JSON", function(t) {
      t.true(isJSONType({"Content-Type": "application/json"}));
    
      t.end();
    });
  });

  t.test("isFormDataType()", function(t) {
    t.test("false if content-type is not form-data", function(t) {
      t.false(isFormDataType({"Content-Type": "text/html"}));
  
      t.end();
    });

    t.test("true if content-type is form-data", function(t) {
      t.true(isFormDataType({"Content-Type": "multipart/form-data; boundary=123"}));
    
      t.end();
    });
  });

  t.test("ContentTypes", function(t) {
    t.test("provides basic content types", function(t) {
      t.true(isJSONType({"Content-Type": ContentTypes.JSON}));
      t.true(isTextType({"Content-Type": ContentTypes.text}));
      t.true(isFormDataType({"Content-Type": ContentTypes.formData}));
  
      t.end();
    });
  });
});