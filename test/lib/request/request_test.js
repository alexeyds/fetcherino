import test from "enhanced-tape";
import FormData from "formdata-node";
import Request from "request";

test("Request", function(t) {
  t.test("constructor", function(t) {
    t.test("behaves like node-fetch Request", async function(t) {
      let request = new Request("/test");

      t.equal(request.url, "/test");
      t.equal(request.method, "GET");
      t.equal(await request.text(), "");

      t.end();
    });

    t.test("delegates all options to node-fetch request", async function(t) {
      let request = new Request("/", {body: "test", method: "POST", headers: {"Content-Type": "text/html"}});

      t.equal(request.method, "POST");
      t.equal(request.headers.get("Content-Type"), "text/html");
      t.equal(await request.text(), "test");

      t.end();
    });
  });

  t.test("#formData", function(t) {
    t.test("resolves form-data", async function(t) {
      let fd = new FormData();
      let request = new Request("/", {body: fd, method: "POST"});

      t.equal(await request.formData(), fd);
    
      t.end();
    });
  });
});