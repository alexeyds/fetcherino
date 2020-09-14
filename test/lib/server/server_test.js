import test from "enhanced-tape";
import { testRejects } from "test/support/promise_helpers";
import Request from "fetch_api/request";
import Server from "server";

test("Server", function(t) {
  t.setup(() => {
    return { server: new Server() };
  });

  function fetch(server, path, opts) {
    return server.fetch(new Request(path, opts));
  }

  t.test("#fetch", function(t) {
    t.test("throws if mock not found", async function(t, {server}) {
      await testRejects(t, server.fetch(new Request("/")), /expectation/);
    });
    
    t.test("returns defined response", async function(t, {server}) {
      server.mock("/");
      let response = await fetch(server, "/");

      t.equal(response.status, 200);
      t.equal(await response.text(), "");
    });

    t.test("only returns response once", async function(t, {server}) {
      server.mock("/");

      await fetch(server, "/");
      await testRejects(t, fetch(server, "/"), /expectation/);
    });

    t.test("matches request expectations", async function(t, {server}) {
      server.mock("/", {request: {method: "POST"}});

      await testRejects(t, fetch(server, "/"), /expectation/);
      await fetch(server, "/", {method: "POST"});
    });

    t.test("returns defined response", async function(t, {server}) {
      server.mock("/", {response: {status: 404, body: "foo"}});

      let response = await fetch(server, "/");
      t.equal(response.status, 404);
      t.equal(await response.text(), "foo");
    });

    t.test("extracts request body for comparsion", async function(_t, {server}) {
      server.mock("/", {request: {body: "foobar"}});

      await fetch(server, "/", {body: "foobar", method: "POST"});
    });

    t.test("matches request url", async function(t, {server}) {
      server.mock("/test");

      await testRejects(t, fetch(server, "/"), /expectation/);
      await fetch(server, "/test");
    });

    t.test("supports mocking multiple requests", async function(t, {server}) {
      server.mock("/test", {request: {credentials: "omit"}});
      server.mock("/test", {request: {credentials: "include"}, response: {status: 404}});
      server.mock("/test");

      let response = await fetch(server, "/test", {credentials: "include"});
      t.equal(response.status, 404);
      await fetch(server, "/test");
      await fetch(server, "/test", {credentials: "omit"});
      await testRejects(t, fetch(server, "/test"), /expectation/);
    });
  });

  t.test("#fetch errors", function(t) {
    t.test("includes request details into error message", async function(t, {server}) {
      await testRejects(t, server.fetch(new Request("/foo")), /\/foo/);
    });

    t.test("includes most similar mock into error message", async function(t, {server}) {
      server.mock("/", { request: {method: "POST", credentials: "omit"} });
      server.mock("/test", { request: {body: "foo", credentials: "include"} });
      server.mock("/test", { request: {credentials: "include"} });

      let request = new Request("/test", {method: "POST", body: "foo", credentials: "omit"});
      await testRejects(t, server.fetch(request), /'include'/);
    });
  });

  t.test("#validateAndResetMocks", function(t) {
    t.test("does nothing if there are no mocks", function(_t, {server}) {
      server.validateAndResetMocks();
    });

    t.test("throws and resets mocks if there are mocks remaining", async function(t, {server}) {
      server.mock('/test', {request: { body: "foobar", method: "POST" }});
      
      t.throws(() => server.validateAndResetMocks(), /fetch\.mock/);
      await testRejects(t, fetch(server, "/test", {body: "foobar", method: "POST"}), /expectation/);
    });
  });
});
