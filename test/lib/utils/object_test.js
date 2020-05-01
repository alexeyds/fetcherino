import test from "enhanced-tape";
import { hasMethod, isObject } from "utils/object";

test("utils/object", function(t) {
  t.test("hasMethod()", function(t) {
    t.test("false if object has no method", function(t) {
      t.false(hasMethod({}, "test"));
  
      t.end();
    });

    t.test("true if object has method", function(t) {
      t.true(hasMethod({test: () => {}}, "test"));
    
      t.end();
    });

    t.test("false if object's property is not a function", function(t) {
      t.false(hasMethod({test: 1}, "test"));
    
      t.end();
    });
  });

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