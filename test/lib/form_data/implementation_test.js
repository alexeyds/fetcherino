import test from "enhanced-tape";
import { Request } from "node-fetch";
import { isFormDataType } from "headers/content_type";
import { parseFormData, formDataToObject, objectToFormData } from "form_data/helpers";
import { tranformFormDataInputOptions, implementFormData } from "form_data/implementation";

test("form_data/implementation", function(t) {
  t.test("tranformFormDataInputOptions", function(t) {
    t.test("returns body and headers unmodified if body is not form-data", function(t) {
      let {headers, body} = tranformFormDataInputOptions({headers: {a: 1}, body: "test"});

      t.same(headers, {a: 1});
      t.same(body, "test");
  
      t.end();
    });

    t.test("adds Content-Type to headers", function(t) {
      let {headers} = tranformFormDataInputOptions({body: objectToFormData({})});

      t.true(isFormDataType(headers));
    
      t.end();
    });

    t.test("doesn't overwrite existing headers", function(t) {
      let {headers} = tranformFormDataInputOptions({
        headers: {foo: "bar", "Content-Type": "test"}, 
        body: objectToFormData({})
      });

      t.equal(headers.get("Content-Type"), "test");
      t.equal(headers.get("foo"), "bar");
    
      t.end();
    });

    t.test("encodes body", function(t) {
      let {body} = tranformFormDataInputOptions({body: objectToFormData({foo: "bar"})});

      t.same(formDataToObject(parseFormData(body)), {foo: "bar"});
    
      t.end();
    });
  });

  t.test("implementFormData()", function(t) {
    function buildFormDataRequest({body, headers}) {
      let headersAndBody = tranformFormDataInputOptions({body, headers});
      let request = new Request("/", { method: "POST", ...headersAndBody });
      implementFormData(request);

      return request;
    }

    t.test("#formData() resolves form-data", async function(t) {
      let request = buildFormDataRequest({body: objectToFormData({foo: "bar"})});
      let fd = await request.formData().then(f => f);

      t.same(formDataToObject(fd), {foo: "bar"});
  
      t.end();
    });

    t.test("#formData() consumes body", async function(t) {
      let request = buildFormDataRequest({body: objectToFormData({foo: "bar"})});
      await request.formData();

      let error = await request.text().catch(e => e);
      t.true(error.message.match(/body/));
    
      t.end();
    });

    t.test("#formData() rejects if headers are not of form-data type", async function(t) {
      let request = buildFormDataRequest({body: objectToFormData({}), headers: {"Content-Type": "text/html"}});
      let error = await request.formData().catch(e => e);

      t.true(error.message.match(/content as FormData/));
    
      t.end();
    });
  });
});