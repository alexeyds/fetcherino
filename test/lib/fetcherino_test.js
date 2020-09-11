import test from "enhanced-tape";
import { testRejects } from "test/support/promise_helpers";
import { buildFetch } from "fetcherino";

test("buildFetch", function(t) {
  t.setup(() => ({ fetch: buildFetch() }));

  t.test("fetch()", function(t) {
    t.test("throws 'no expectations' error", async function(t, {fetch}) {
      await testRejects(t, fetch("/test"), /expectation/);
    });
  });

  t.test("fetch.mock()", function(t) {
    t.test("defines fetch expectation", async function(t, {fetch}) {
      fetch.mock('/test', { request: {body: "hi"}, response: {body: 'hello'} });
      let response = await fetch('/test', {method: "POST", body: "hi"});

      t.equal(await response.text(), 'hello');
    });
  });

  t.test("fetch.validateAndResetMocks()", function(t) {
    t.test("validates mocks", function(t, {fetch}) {
      fetch.mock('/test');
      t.throws(() => fetch.validateAndResetMocks(), /expectation/);
    });
  });
});
