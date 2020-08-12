import test from "enhanced-tape";
import FormData from "fetch_api/form_data";
import Blob from "support/blob_stub";
import BodyWithContentType from "fetch_api/body/body_with_content_type";

test("BodyWithContentType", function(t) {
  t.test("#contentType", function(t) {
    function contentType(body) {
      return new BodyWithContentType({body}).contentType;
    }

    t.test("with Blob", function(t) {
      t.equal(contentType(new Blob({type: "file"})), "file");
      t.equal(contentType(new Blob({type: ""})), null);
    });

    t.test("with FormData", function(t) {
      t.match(contentType(new FormData()), /^multipart\/form-data; boundary=/);
    });

    t.test("with URLSearchParams", function(t) {
      t.equal(contentType(new URLSearchParams()), "application/x-www-form-urlencoded;charset=UTF-8");
    });

    t.test("with String", function(t) {
      t.equal(contentType("foobar"), "text/plain;charset=UTF-8");
    });

    t.test("prefers provided {contentType}", function(t) {
      let body = new BodyWithContentType({body: "foobar", contentType: "text/html"});
      t.equal(body.contentType, "text/html");
    });

    t.test("returns null by default", function(t) {
      t.equal(contentType(new ArrayBuffer), null);
    });

    t.test("uses serialized body for content type check", function(t) {
      t.equal(contentType(123), "text/plain;charset=UTF-8");
    });
  });

  t.test("#body", function(t) {
    function body(object) {
      return new BodyWithContentType({body: object}).body;
    }

    t.test("returns valid body types unchanged", function(t) {
      let buffer = new ArrayBuffer();
      t.equal(body(buffer), buffer);

      let view = new DataView(buffer);
      t.equal(body(view), view);
    });

    t.test("converts unsupported body types to string", function(t) {
      t.equal(body(123), "123");
    });

    t.test("converts null to empty string", function(t) {
      t.equal(body(null), "");
    });

    t.test("is empty by default", function(t) {
      t.equal(body(undefined), "");
    });

    t.test("converts string to URLSearchParams if content-type is x-www-form-urlencoded", function(t) {
      let body = new BodyWithContentType({body: "test=1", contentType: "application/x-www-form-urlencoded"});
      let result = body.body;

      t.equal(result.constructor, URLSearchParams);
      t.equal(result.get("test"), "1");
    });
  });

  t.test("#text", function(t) {
    function text(body) {
      return new BodyWithContentType({body}).text();
    }

    t.test("returns string bodies unchanged", async function(t) {
      t.equal(await text("foobar"), "foobar");
    });

    t.test("converts ArrayBufferView to string", async function(t) {
      let view = new Uint8Array([ 209, 132, 209, 139, 208, 178, 209, 132, 209, 139, 208, 178]);
      t.equal(await text(view), "фывфыв");
    });

    t.test("converts ArrayBuffer to string", async function(t) {
      let buffer = new ArrayBuffer();
      t.equal(await text(buffer), "");
    });

    t.test("calls #text method on Blobs", async function(t) {
      let blob = new Blob();
      blob.text = () => Promise.resolve("ima blob");
      t.equal(await text(blob), "ima blob");
    });

    t.test("throws if body is FormData", async function(t) {
      let fd = new FormData();
      t.throws(() => text(fd), /support/);
    });

    t.test("encodes URLSearchParams", async function(t) {
      let search = new URLSearchParams({foo: "1"});
      t.equal(await text(search), "foo=1");
    });
  });

  t.test("#blob", function(t) {
    function blob(body) {
      return new BodyWithContentType({body}).blob();
    }

    t.test("returns Blob", async function(t) {
      let body = new Blob();
      t.equal(await blob(body), body);
    });

    t.test("throws if body is anything else", async function(t) {
      t.throws(() => blob("123"), /support/);
    });
  });

  t.test("#formData", function(t) {
    function formData(body) {
      return new BodyWithContentType({body}).formData();
    }

    t.test("returns formData", async function(t) {
      let fd = new FormData();
      t.equal(await formData(fd), fd);
    });

    t.test("rejects if body is not formData", async function(t) {
      let error = await formData("formdata").then(() => undefined, e => e);

      t.equal(error.name, "TypeError");
      t.match(error.message, /parse/);
    });

    t.test("rejects if content-type is not form-data", async function(t) {
      let body = new BodyWithContentType({body: new FormData(), contentType: "text/html"});
      let error = await body.formData().then(() => undefined, e => e);

      t.assert(error);
    });

    t.test("converts URLSearchParams to formData", async function(t) {
      let params = new URLSearchParams({foo: "bar"});
      let result = await formData(params);

      t.equal(result.constructor, FormData);
      t.equal(result.get("foo"), "bar");
    });

    t.test("rejects if content-type is not form-encoded", async function(t) {
      let body = new BodyWithContentType({body: new URLSearchParams(), contentType: "text/html"});
      let error = await body.formData().then(() => undefined, e => e);

      t.assert(error);
    });
  });

  t.test("#arrayBuffer", function(t) {
    function arrayBuffer(body) {
      return new BodyWithContentType({body}).arrayBuffer();
    }

    t.test("returns ArrayBuffer unchanged", async function(t) {
      let buffer = new ArrayBuffer();

      let result = await arrayBuffer(buffer);
      t.equal(result, buffer);
    });

    t.test("extracts buffer form ArrayBufferView", async function(t) {
      let buffer = new ArrayBuffer();
      let view = new DataView(buffer);

      let result = await arrayBuffer(view);
      t.equal(result, buffer);
    });

    t.test("converts Blobs to ArrayBuffer", async function(t) {
      let buffer = new ArrayBuffer();
      let blob = new Blob();
      blob.arrayBuffer = () => buffer;

      let result = await arrayBuffer(blob);
      t.equal(result, buffer);
    });

    t.test("converts everything else to text and then to array buffer", async function(t) {
      let result = await arrayBuffer(new URLSearchParams({foo: "bar"}));
      let decoded = new TextDecoder().decode(result);
      t.equal(decoded, "foo=bar");
    });
  });

  t.test("#json", function(t) {
    function json(body) {
      return new BodyWithContentType({body}).json();
    }

    t.test("parses JSON", async function(t) {
      let result = await json('{"a": "b"}');

      t.same(result, {a: "b"});
    });

    t.test("rejects if json is invalid", async function(t) {
      let error = await json('faskdfk').then(() => undefined, e => e);

      t.equal(error.name, "SyntaxError");
      t.match(error.message, /JSON/);
    });

    t.test("converts body to text before parsing", async function(t) {
      let buffer = new TextEncoder().encode('{"a": "b"}');
      let result = await json(buffer);

      t.same(result, {a: "b"});
    });
  });
});
