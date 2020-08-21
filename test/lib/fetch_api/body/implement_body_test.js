import test from "enhanced-tape";
import implementBody from "fetch_api/body/implement_body";

class MyRequest {
  constructor({body, headersLike}) {
    let { headers } = implementBody.call(this, {body, headersLike});
    this.headers = headers;
  }
}

test("implementBody", function(t) {
  t.test("{headers}", function(t) {
    let headersToArr = (headers) => Array.from(headers.entries());

    t.test("are empty by default", function(t) {
      let request = new MyRequest({});
      t.same(headersToArr(request.headers), []);
    });

    t.test("are populated from {headersLike} object", function(t) {
      let request = new MyRequest({headersLike: {foo: "bar"}});
      t.same(headersToArr(request.headers), [["foo", "bar"]]);
    });

    t.test("have content-type based on body type", function(t) {
      let request = new MyRequest({body: ""});
      t.match(request.headers.get("content-type"), /text\/plain/);
    });

    t.test("prefer explicitly set content-type", function(t) {
      let request = new MyRequest({body: "", headersLike: {"Content-Type": "text/html"}});
      t.equal(request.headers.get("content-type"), "text/html");
    });
  });

  t.test("#body", function(t) {
    t.test("throws error", function(t) {      
      let request = new MyRequest({body: "foobar"});
      t.throws(() => request.body, /fetcherino/);
    });
  });

  t.test("#bodyUsed", function(t) {
    t.test("is false by default", function(t) {
      let request = new MyRequest({body: "foobar"});
      t.equal(request.bodyUsed, false);
    });
  });

  t.test("#text()", function(t) {
    t.test("converts body to text", async function(t) {
      let request = new MyRequest({body: new TextEncoder().encode("foobar")});
      let body = await request.text().then(b => b);

      t.equal(body, "foobar");
    });

    t.test("sets bodyUsed to true", async function(t) {
      let request = new MyRequest({body: "foobar"});
      await request.text();
      
      t.equal(request.bodyUsed, true);
    });

    t.test("rejects if body was already used", async function(t) {
      let request = new MyRequest({body: "foobar"});
      await request.text();
      let error = await request.text().then(() => {}, e => e);

      t.notEqual(error, undefined);
      t.match(error.message, /consumed/);
    });
  });

  t.test("defines multiple body reader methods", async function(t) {
    let request = new MyRequest({body: "{\"a\": 1}"});
    t.equal(typeof request.arrayBuffer, "function");
    t.equal(typeof request.blob, "function");
    t.equal(typeof request.formData, "function");
    t.equal(typeof request.json, "function");

    let json = await request.json();
    t.same(json, {a: 1});
  });
});
