import test from "enhanced-tape";
import { testRejects } from "test/support/promise_helpers";
import { buildFetch } from "dist/fetcherino";

// mock once
// partial body matching
// mock reset
// formdata support
// fetcherino/matchers

test("README test", function(t) {
  t.setup(() => ({ fetch: buildFetch() }));

  t.test("example usage", function(t) {
    t.test("simple example", async function(t, {fetch}) {
      fetch.mock('/test');
      let response = await fetch('/test');

      t.equal(response.status, 200);
      t.equal(await response.text(), '');
      await testRejects(t, fetch("/test"), /Unexpected/);
    });
  });
});