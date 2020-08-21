import test from "enhanced-tape";
import Request from "fetch_api/request";

test("Request", function(t) {
  t.test("initialization", function(t) {
    t.test("throws if no url is provided", function(t) {
      t.throws(() => new Request(), /1 argument/);
    });

    t.test("assigns default values", function(t) {
      let request = new Request("/");
      
      t.equal(request.url, "/");
      t.equal(request.cache, "default");
      t.equal(request.credentials, "same-origin");
      t.equal(request.integrity, "");
      t.equal(request.method, "GET");
      t.equal(request.mode, "cors");
      t.equal(request.redirect, "follow");
      t.equal(request.referrer, "about:client");
    });

    t.test("allows overwriting default values", function(t) {
      let request = new Request("/", { mode: "no-cors", redirect: "error", credentials: "include" });

      t.equal(request.mode, "no-cors");
      t.equal(request.redirect, "error");
      t.equal(request.credentials, "include");
    });
    
    t.test("ignores wrong options", function(t) {
      let request = new Request("/", { testMe: "123" });

      t.equal(request.testMe, undefined);
    });

    ["cache", "mode", "redirect", "credentials"].forEach(option => {
      t.test(`validates #${option} option`, function(t) {
        t.throws(() => new Request("/", {[option]: "foobar"}), /not a valid value/);
      });
    });
  });

  t.test("#destination", function(t) {
    t.test("returns empty string", function(t) {
      t.equal(new Request("/").destination, "");
    });
  });

  t.test("referrerPolicy", function(t) {
    t.test("returns empty string", function(t) {
      t.equal(new Request("/").referrerPolicy, "");
    });
  });

  t.test("#method", function(t) {
    t.test("converts standart method to upper-case", function(t) {
      let request = new Request("/", {method: "post"});
      t.equal(request.method, "POST");
    });

    t.test("leaves non-standart methods as is", function(t) {
      let request = new Request("/", {method: "foo"});
      t.equal(request.method, "foo");
    });
  });

  t.test("body implementation", function(t) {
    t.test("includes Body mixin", async function(t) {
      let request = new Request("/test", {body: "foobar", method: "POST"});

      t.equal(request.bodyUsed, false);
      t.equal(await request.text(), "foobar");
      t.equal(request.bodyUsed, true);
    });

    t.test("has headers", function(t) {      
      let request = new Request("/test", {body: "foobar", method: "POST"});
      t.match(request.headers.get("content-type"), /text\/plain/);
    });
  });
});
