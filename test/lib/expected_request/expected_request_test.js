import test from "enhanced-tape";
import Request from "request";
import { ContentTypes } from "headers/content_type";
import ExpectedRequest from "expected_request";

function buildExpected() {
  let request = new Request(...arguments);
  return new ExpectedRequest(request);
}

test("ExpectedRequest", function(t) {
  t.test("#isEqual", function(t) {
    t.test("true if requests are equal", function(t) {
      let expected = buildExpected("/test");
      let actual = new Request("/test");

      t.true(expected.isEqual(actual));
  
      t.end();
    });

    t.test("matches url", function(t) {
      let expected = buildExpected("/test");
      let actual = new Request("/tests");

      t.false(expected.isEqual(actual));
    
      t.end();
    });

    t.test("matches method", function(t) {
      let expected = buildExpected("/test", {method: "POST"});
      let actual = new Request("/test");

      t.false(expected.isEqual(actual));
    
      t.end();
    });

    t.test("matches text body", function(t) {
      let expected = buildExpected("/test", {method: "POST", body: "123"});
      let actual = new Request("/test", {method: "POST", body: "321"});

      t.false(expected.isEqual(actual));
    
      t.end();
    });

    t.test("matches JSON bodies", function(t) {
      let JSONParams = (obj) => {
        return {method: "POST", body: JSON.stringify(obj), headers: {"Content-Type": ContentTypes.JSON}};
      };

      let expected = buildExpected("/test", JSONParams({a: 1, b: 2}));
      let actual = new Request("/test", JSONParams({b: 2, a: 1}));

      t.true(expected.isEqual(actual));
    
      t.end();
    });
  });

  t.test("#inspect", function(t) {
    t.test("inspects request", function(t) {
      let expected = buildExpected("/test");
      let info = expected.inspect();

      t.true(info.match(/\/test/));
      t.true(info.match(/GET/));

      t.end();
    });
  });
});