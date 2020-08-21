import test from "enhanced-tape";
import checkers from "content_type/type_checkers";

test("Content type checkers", function(t) {
  t.test("isText", function(t) {
    t.equal(checkers.isText("text/plain;charset=UTF-8"), true);
    t.equal(checkers.isText("text/html"), false);
  
    t.end();
  });

  t.test("isJSON", function(t) {
    t.equal(checkers.isJSON("application/json"), true);
    t.equal(checkers.isJSON("text/plain"), false);
  
    t.end();
  });

  t.test("isFormData", function(t) {
    t.equal(checkers.isFormData("multipart/form-data; boundary=123"), true);
    t.equal(checkers.isFormData("text/plain"), false);
  
    t.end();
  });

  t.test("isFormURLEncoded", function(t) {
    t.equal(checkers.isFormURLEncoded("application/x-www-form-urlencoded"), true);
    t.equal(checkers.isFormURLEncoded("text/plain"), false);
  
    t.end();
  });
});
