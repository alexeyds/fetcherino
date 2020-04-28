import test from "enhanced-tape";
import { Request } from "node-fetch";
import Server from "server";

test("Server", function(t) {
  t.test("#processRequest", function(t) {
    t.test("returns {success: false} if no response found", function(t) {
      let server = new Server();

      let request = new Request("/test");
      let result = server.processRequest(request);

      t.equal(result.success, false);
  
      t.end();
    });

    t.test("matches request against mock", function(t) {
      let server = new Server();

      server.addMock("/test");
      let result = server.processRequest(new Request("/test_me"));

      t.equal(result.success, false);
    
      t.end();
    });

    t.test("only mocks request once", function(t) {
      let server = new Server();

      server.addMock("/test");
      server.processRequest(new Request("/test"));
      let result = server.processRequest(new Request("/test"));

      t.equal(result.success, false);
    
      t.end();
    });
  });

  t.test("#addMock", function(t) {
    t.test("adds mocked response", function(t) {
      let server = new Server();

      server.addMock("/test");
      let result = server.processRequest(new Request("/test"));

      t.equal(result.success, true);
      t.equal(result.response.status, 200);
  
      t.end();
    });

    t.test("delegates arguments to response builder", function(t) {
      let server = new Server();

      server.addMock("/test", {status: 404});
      let { response } = server.processRequest(new Request("/test"));

      t.equal(response.status, 404);
    
      t.end();
    });

    t.test("delegates arguments to request builder", function(t) {
      let server = new Server();

      server.addMock("/test", {method: "POST"});
      let result = server.processRequest(new Request("/test", {method: "POST"}));

      t.equal(result.success, true);
    
      t.end();
    });
  });

  t.test("#addJSONMock", function(t) {
    t.test("adds expect JSON request", function(t) {
      let server = new Server();

      server.addJSONMock("/test", {method: "POST", requestBody: {foo: "bar"}});
      let request = new Request("/test", {method: "POST", body: JSON.stringify({foo: "bar"}), headers: {"Content-Type": "application/json"}});
      let result = server.processRequest(request);

      t.equal(result.success, true);
    
      t.end();
    });
  });

  t.test("#inspectMocks", function(t) {
    t.test("returns info about current mocks", function(t) {
      let server = new Server();

      server.addMock("/test_plain");
      server.addJSONMock("/test_json", {method: "POST", requestBody: {foo: "bar"}});
      let info = server.inspectMocks();

      t.true(info.match(/\/test_plain/));
      t.true(info.match(/\/test_json/));
      t.true(info.match(/foo/));
  
      t.end();
    });
  });
});