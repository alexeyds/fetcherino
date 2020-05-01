import test from "enhanced-tape";
import { isObject } from "utils/object";

test("utils/object", function(t) {

  t.test("isObject()", function(t) {
    t.test("true if value is object", function(t) {
      t.equal(isObject({}), true);
    
      t.end();
    });

    t.test("false if value is not an object", function(t) {
      t.equal(isObject(1), false);
    
      t.end();
    });
  });
});