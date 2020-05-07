import test from "enhanced-tape";
import Request from "request";
import { ContentTypes } from "headers/content_type";
import { objectToFormData } from "form_data/helpers";
import { inspectRequest } from "request/inspect";

test("request/inspect", function(t) {
  t.test("inspectRequest()", function(t) {
    t.test("inspects simple requests", function(t) {
      let request = new Request("/test");
      let info = inspectRequest(request);
      
      t.true(info.match(/\/test/));
      t.true(info.match(/GET/));

      t.end();
    });

    t.test("inspects requests with body", function(t) {
      let request = new Request("/test", {body: "test_req", method: "POST"});
      let info = inspectRequest(request);
      
      t.true(info.match(/test_req/));
    
      t.end();
    });

    t.test("inspects JSON requests", function(t) {
      let request = new Request("/test", {
        body: JSON.stringify({foo: "bar"}), 
        method: "POST",
        headers: {"Content-Type": ContentTypes.JSON}
      });
      let info = inspectRequest(request);
      
      t.true(info.match(/JSON/));
    
      t.end();
    });

    t.test("inspects FormData requests", function(t) {
      let request = new Request("/test", {
        body: objectToFormData({foo: "bar"}), 
        method: "POST"
      });
      let info = inspectRequest(request);
      
      t.true(info.match(/form-data/));
    
      t.end();
    });
  });
});