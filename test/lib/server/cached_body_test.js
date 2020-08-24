import test from "enhanced-tape";
import ContentTypes from "content_type/types";
import FormData from "fetch_api/form_data";
import Request from "fetch_api/request";
import CachedBody from "server/cached_body";

test("CachedBody", function(t) {
  function buildBody({body, contentType}) {
    let headers = contentType ? {"content-type": contentType} : undefined;
    let request = new Request("/", {body, headers, method: "POST"});
    return new CachedBody(request);
  }

  t.test("#extract", function(t) {
    t.test("extracts request body", async function(t) {
      let body = buildBody({body: "foobar"});
      let result = await body.extract();

      t.equal(result, "foobar");
    });

    t.test("caches request body", async function(t) {
      let body = buildBody({body: "foobar"});
      await body.extract();
      let result = await body.extract();

      t.equal(result, "foobar");
    });

    t.test("can extract bodies with no content-type", async function(t) {
      let body = buildBody({});
      let result = await body.extract();

      t.equal(result, "");
    });

    t.test("parses JSON bodies", async function(t) {
      let body = buildBody({body: JSON.stringify({foo: "bar"}), contentType: ContentTypes.json()});
      let result = await body.extract();

      t.same(result, {foo: "bar"});
    });

    t.test("parses formData", async function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      let body = buildBody({body: fd});
      let result = await body.extract();

      t.same(result, {foo: "bar"});
    });

    t.test("parses form-url-encoded as formdata", async function(t) {
      let form = new URLSearchParams("foo[]=bar&foo[]=baz");
      let body = buildBody({body: form});
      let result = await body.extract();

      t.same(result, {foo: ["bar", "baz"]});
    });
  });
});
