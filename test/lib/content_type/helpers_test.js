import test from "enhanced-tape";
import { Response } from "node-fetch";
import { isTextType, isJSONType, isFormDataType, ContentTypes } from "content_type/helpers";

function contentWithType(type) {
  let headers;

  if (type === null) {
    headers = {};
  } else {
    headers = {"Content-Type": type};
  }

  return new Response(null, {headers});
}

test("content_type/helpers", function(t) {
  t.test("isTextType()", function(t) {
    t.test("false if content-type is null", function(t) {
      t.false(isTextType(contentWithType(null)));
  
      t.end();
    });

    t.test("true if content-type is plain text", function(t) {
      t.true(isTextType(contentWithType("text/plain;utf-8")));
    
      t.end();
    });

    t.test("false if content-type is not text", function(t) {
      t.false(isTextType(contentWithType("text/html")));
  
      t.end();
    });
  });

  t.test("isJSONType()", function(t) {
    t.test("false if content-type is not JSON", function(t) {
      t.false(isJSONType(contentWithType("text/html")));
  
      t.end();
    });

    t.test("true if content-type is JSON", function(t) {
      t.true(isJSONType(contentWithType("application/json")));
    
      t.end();
    });
  });

  t.test("isFormDataType()", function(t) {
    t.test("false if content-type is not form-data", function(t) {
      t.false(isFormDataType(contentWithType("text/html")));
  
      t.end();
    });

    t.test("true if content-type is form-data", function(t) {
      t.true(isFormDataType(contentWithType("multipart/form-data; boundary=123")));
    
      t.end();
    });
  });

  t.test("ContentTypes", function(t) {
    t.test("provides basic content types", function(t) {
      t.true(isJSONType(contentWithType(ContentTypes.JSON)));
      t.true(isTextType(contentWithType(ContentTypes.text)));
      t.true(isFormDataType(contentWithType(ContentTypes.formData)));
  
      t.end();
    });
  });
});