import test from "enhanced-tape";
import Request from "request";
import { ContentTypes } from "headers/content_type";
import { objectToFormData } from "form_data/helpers";
import { parseRequestBody } from "request/body";

test("request/body", function(t) {
  t.test("parseRequestBody()", function(t) {
    t.test("parses text body", function(t) {
      let request = new Request("/", {body: "test", method: "POST"});

      t.equal(parseRequestBody(request), "test");
    
      t.end();
    });

    t.test("works for requests without body", function(t) {
      let request = new Request("/");

      t.equal(parseRequestBody(request), null);
    
      t.end();
    });

    t.test("parses JSON body", function(t) {
      let request = new Request("/", {
        body: JSON.stringify({a: 1}), 
        method: "POST", 
        headers: {"Content-Type": ContentTypes.JSON}
      });

      t.same(parseRequestBody(request), {a: 1});
    
      t.end();
    });

    t.test("parses form data body", function(t) {
      let request = new Request("/", {body: objectToFormData({foo: "bar"}), method: "POST"});

      t.same(parseRequestBody(request), {foo: "bar"});
    
      t.end();
    });
  });
});