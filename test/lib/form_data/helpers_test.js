import test from "enhanced-tape";
import FormData from "formdata-node";
import { isFormData, formDataToObject, objectToFormData, stringifyFormData, parseFormData } from "form_data/helpers";

test("form_data/helpers", function(t) {
  t.test("isFormData()", function(t) {
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

  t.test("formDataToObject()", function(t) {
    t.test("extracts formdata entries", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");

      t.same(formDataToObject(fd), {foo: "bar"});
  
      t.end();
    });
  });

  t.test("objectToFormData()", function(t) {
    t.test("converts formData to object", function(t) {
      let fd = objectToFormData({foo: "bar"});

      t.equal(fd.get("foo"), "bar");
    
      t.end();
    });
  });

  t.test("stringifyFormData()", function(t) {
    t.test("returns string", function(t) {
      t.equal(typeof stringifyFormData(new FormData()), "string");
  
      t.end();
    });
  });

  t.test("parseFormData()", function(t) {
    t.test("parses stringified form data", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      let result = parseFormData(stringifyFormData(fd));

      t.true(isFormData(result));

      t.same(formDataToObject(result), {foo: "bar"});
  
      t.end();
    });

    t.test("throws if string is invalid", function(t) {
      t.throws(() => {
        parseFormData("wrong");
      }, /FormData/);
    
      t.end();
    });
  });
});