import test from "enhanced-tape";
import { isText, isJSON, isFormData, isFormURLEncoded } from "utils/content_type_checkers";

test("Content type checkers", function(t) {
  t.test("isText", function(t) {
    t.equal(isText("text/plain;charset=UTF-8"), true);
    t.equal(isText("text/html"), false);
  
    t.end();
  });

  t.test("isJSON", function(t) {
    t.equal(isJSON("application/json"), true);
    t.equal(isJSON("text/plain"), false);
  
    t.end();
  });

  t.test("isFormData", function(t) {
    t.equal(isFormData("multipart/form-data; boundary=123"), true);
    t.equal(isFormData("text/plain"), false);
  
    t.end();
  });

  t.test("isFormURLEncoded", function(t) {
    t.equal(isFormURLEncoded("application/x-www-form-urlencoded"), true);
    t.equal(isFormURLEncoded("text/plain"), false);
  
    t.end();
  });
});
