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
      await testRejects(t, server.fetch(new Request("/")), /mock/);
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
      await testRejects(t, fetch(server, "/"), /mock/);
    });

    t.test("matches request expectations", async function(t, {server}) {
      server.mock("/", {request: {method: "POST"}});

      await testRejects(t, fetch(server, "/"), /mock/);
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

      await testRejects(t, fetch(server, "/"), /mock/);
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
      await testRejects(t, fetch(server, "/test"), /mock/);
    });
  });
});
