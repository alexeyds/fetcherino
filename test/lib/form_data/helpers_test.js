import test from "enhanced-tape";
import FormData from "formdata-node";
import { isFormData, formDataToObject } from "form_data/helpers";

test("form_data/helpers", function(t) {
  t.test("isFormData", function(t) {
    t.test("false if object doesn't support FormData interface", function(t) {
      t.equal(isFormData({}), false);
  
      t.end();
    });

    t.test("true if object supports FormData interface", function(t) {
      t.equal(isFormData(new FormData()), true);
    
      t.end();
    });

    t.test("doesn't throw for undefined or null", function(t) {
      t.equal(isFormData(undefined), false);
      t.equal(isFormData(null), false);
    
      t.end();
    });
  });

  t.test("formDataToObject", function(t) {
    t.test("extracts formdata entries", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");

      t.same(formDataToObject(fd), {foo: "bar"});
  
      t.end();
    });
  });
});