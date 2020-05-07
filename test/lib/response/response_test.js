import test from "enhanced-tape";
import { formDataToObject, objectToFormData } from "form_data/helpers";
import Response from "response";

test("Response", function(t) {
  t.test("constructor", function(t) {
    t.test("behaves like node-fetch Response", async function(t) {
      let response = new Response("foo");

      t.equal(await response.text(), "foo");

      t.end();
    });

    t.test("delegates all options to node-fetch response", async function(t) {
      let response = new Response("", {status: 404, headers: {"Content-Type": "text/html"}});

      t.equal(response.status, 404);
      t.equal(response.headers.get("Content-Type"), "text/html");

      t.end();
    });
  });

  t.test("#formData", function(t) {
    t.test("resolves form-data", async function(t) {
      let response = new Response(objectToFormData({foo: "bar"}));

      t.same(formDataToObject(await response.formData()), {foo: "bar"});
    
      t.end();
    });
  });
});