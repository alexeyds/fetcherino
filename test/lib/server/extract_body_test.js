import test from "enhanced-tape";
import ContentTypes from "content_type/types";
import FormData from "fetch_api/form_data";
import Request from "fetch_api/request";
import extractBody from "server/extract_body";

test("CachedBody", function(t) {
  function buildRequest({body, contentType}) {
    let headers = contentType ? {"content-type": contentType} : undefined;
    return new Request("/", {body, headers, method: "POST"});
  }

  t.test("#extract", function(t) {
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

    t.test("parses formData", async function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      let request = buildRequest({body: fd});
      let result = await extractBody(request);

      t.same(result, {foo: "bar"});
    });

    t.test("parses form-url-encoded as formdata", async function(t) {
      let form = new URLSearchParams("foo[]=bar&foo[]=baz");
      let request = buildRequest({body: form});
      let result = await extractBody(request);

      t.same(result, {foo: ["bar", "baz"]});
    });
  });
});
