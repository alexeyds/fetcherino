import jutest from "jutest";
import ContentTypes from "content_type/types";
import FormData from "fetch_api/form_data";
import Request from "fetch_api/request";
import extractBody from "server/extract_body";

jutest("CachedBody", function(t) {
  function buildRequest({body, contentType}) {
    let headers = contentType ? {"content-type": contentType} : undefined;
    return new Request("/", {body, headers, method: "POST"});
  }

  t.describe("#extract", function(t) {
    t.test("extracts request body", async function(t) {
      let request = buildRequest({body: "foobar"});
      let result = await extractBody(request);

      t.equal(result, "foobar");
    });

    t.test("can extract bodies with no content-type", async function(t) {
      let request = buildRequest({});
      let result = await extractBody(request);

      t.equal(result, "");
    });

    t.test("parses JSON bodies", async function(t) {
      let request = buildRequest({body: JSON.stringify({foo: "bar"}), contentType: ContentTypes.json()});
      let result = await extractBody(request);

      t.same(result, {foo: "bar"});
    });

    t.test("returns unparsable JSON bodies as text", async function(t) {
      let request = buildRequest({body: null, contentType: ContentTypes.json()});
      let result = await extractBody(request);

      t.same(result, '');
    });

    t.test("parses formData", async function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      let request = buildRequest({body: fd});
      let result = await extractBody(request);

      t.same(result, {foo: "bar"});
    });

    t.test("returns unparsable FormData bodies as text", async function(t) {
      let request = buildRequest({body: null, contentType: ContentTypes.formData({boundary: '123'})});
      let result = await extractBody(request);

      t.same(result, 'Unparsable FormData body');
    });

    t.test("parses form-url-encoded as formdata", async function(t) {
      let form = new URLSearchParams("foo[]=bar&foo[]=baz");
      let request = buildRequest({body: form});
      let result = await extractBody(request);

      t.same(result, {foo: ["bar", "baz"]});
    });
  });
});
