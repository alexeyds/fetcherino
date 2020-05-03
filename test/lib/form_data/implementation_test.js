import test from "enhanced-tape";
import FormData from "formdata-node";
import { Request } from "node-fetch";
import { isFormDataType } from "headers/content_type";
import { implementFormData, maybeAddFormDataContentType } from "form_data/implementation";

test("form_data/implementation", function(t) {
  t.test("maybeAddFormDataContentType()", function(t) {
    t.test("returns headers unmodified if body is not form data", function(t) {
      let headers = {};
      let result = maybeAddFormDataContentType(headers, {body: "test"});

      t.same(result, headers);
  
      t.end();
    });

    t.test("adds Content-Type if body is form data", function(t) {
      let result = maybeAddFormDataContentType({}, {body: new FormData()});

      t.true(isFormDataType(result));
    
      t.end();
    });

    t.test("doesn't overwrite existing headers", function(t) {
      let result = maybeAddFormDataContentType({foo: "bar", "Content-Type": "test"}, {body: new FormData()});

      t.equal(result.get("Content-Type"), "test");
      t.equal(result.get("foo"), "bar");
    
      t.end();
    });
  });

  t.test("implementFormData()", function(t) {
    t.test("#formData resolves form-data", async function(t) {
      let body = new FormData();
      let headers = maybeAddFormDataContentType({}, {body});
      let request = new Request("/", { method: "POST", body, headers});

      implementFormData(request, {body});
      t.equal(await request.formData().then(f => f), body);
    
      t.end();
    });

    t.test("#formData rejects if headers are not form-data", async function(t) {
      let body = new FormData();
      let request = new Request("/", { method: "POST", body});

      implementFormData(request, {body});
      let error = await request.formData().then(() => {}, e => e);

      t.true(error.message.match(/content as FormData/));
    
      t.end();
    });

    t.test("#formData rejects if {body} is not form-data", async function(t) {
      let body = new FormData();
      let headers = maybeAddFormDataContentType({}, {body});
      let request = new Request("/", { method: "POST", body, headers});

      implementFormData(request, {body: ""});
      let error = await request.formData().then(() => {}, e => e);

      t.true(error.message.match(/content as FormData/));
  
      t.end();
    });


    t.test("#formData consumes body on call", async function(t) {
      let request = new Request("/");
      implementFormData(request, {body: ""});
      await request.formData().catch(() => {});
      let error = await request.text().catch(e => e);

      t.true(error.message.match(/body/));
    
      t.end();
    });
  });
});