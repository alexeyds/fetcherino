import test from "enhanced-tape";
import Response from "fetch_api/response";

test("Response", function(t) {
  t.test("initialization", function(t) {
    t.test("assigns default values", function(t) {
      let response = new Response();

      t.equal(response.ok, true);
      t.equal(response.redirected, false);
      t.equal(response.status, 200);
      t.equal(response.statusText, "");
      t.equal(response.type, "default");
      t.equal(response.url, "");
    });
  });

  let buildResponse = (options) => new Response(null, options);

  t.test("{statusText} option", function(t) {
    t.test("sets statusText", function(t) {
      t.equal(buildResponse({statusText: "foo"}).statusText, "foo");
    });
  });

  t.test("{status} option", function(t) {
    t.test("sets status", function(t) {
      let response = buildResponse({status: 202});
      t.equal(response.status, 202);
      t.equal(response.ok, true);
    });

    t.test("sets ok to false if status is not 200-299", function(t) {
      let response = buildResponse({status: 300});
      t.equal(response.ok, false);
    });

    t.test("throws if status is invalid", function(t) {
      t.throws(() => { buildResponse({status: 600}); }, /status code/);
      t.throws(() => { buildResponse({status: 199}); }, /status code/);
    });
  });

  t.test("body implementation", function(t) {
    t.test("includes Body mixin", async function(t) {
      let response = new Response("foobar");

      t.equal(response.bodyUsed, false);
      t.equal(await response.text(), "foobar");
      t.equal(response.bodyUsed, true);
    });

    t.test("has headers", function(t) {      
      let response = new Response("foobar");
      t.match(response.headers.get("content-type"), /text\/plain/);
    });
  });
});
