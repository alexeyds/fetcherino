import jutest from "jutest";
import { testRejects } from "test/support/promise_helpers";
import Request from "fetch_api/request";
import { buildFetch } from "fetcherino";

jutest("buildFetch", function(t) {
  t.setup(() => ({ fetch: buildFetch() }));

  t.describe("fetch()", function(t) {
    t.test("throws 'no expectations' error", async function(t, {fetch}) {
      await testRejects(t, fetch("/test"), /expectation/);
    });

    t.test("works with a pre-made Request object", async function(t, {fetch}) {
      await testRejects(t, fetch(new Request("/test")), /expectation/);
    });

    t.test("throws if Request object is followed by any other arguments", async function(t, {fetch}) {
      await testRejects(t, fetch(new Request("/test"), 1), /not a function/);
    });
  });

  t.describe("fetch.mock()", function(t) {
    t.test("defines fetch expectation", async function(t, {fetch}) {
      fetch.mock('/test', { request: {body: "hi"}, response: {body: 'hello'} });
      let response = await fetch('/test', {method: "POST", body: "hi"});

      t.equal(await response.text(), 'hello');
    });

    t.test("works with simple json requests", async function(t, {fetch}) {
      fetch.mock('/test', { response: {body: 'not json'} });
      let response = await fetch('/test', { headers: { 'Content-Type': 'application/json'} });

      t.equal(await response.text(), 'not json');
    });

    t.test("works with simple formdata requests", async function(t, {fetch}) {
      fetch.mock('/test', { response: {body: 'hi'} });
      let response = await fetch('/test', { headers: { 'Content-Type': 'multipart/form-data'} });

      t.equal(await response.text(), 'hi');
    });
  });

  t.describe("fetch.validateAndResetMocks()", function(t) {
    t.test("validates mocks", function(t, {fetch}) {
      fetch.mock('/test');
      t.throws(() => fetch.validateAndResetMocks(), /expectation/);
    });
  });
});
