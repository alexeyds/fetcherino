import jutest from "jutest";
import FormData from "fetch_api/form_data";
import { formToObject } from "utils/form";

jutest("Form utils", function(t) {
  t.describe("formToObject()", function(t) {
    t.test("converts FormData to object", function(t) {
      let fd = new FormData();
      fd.append("foo", "baz");
      fd.append("foo", "bar");

      t.same(formToObject(fd), {foo: "bar"});
    });

    t.test("supports arrays", function(t) {
      let fd = new FormData();
      fd.append("foo[]", "baz");
      fd.append("foo[]", "bar");

      t.same(formToObject(fd), {foo: ["baz", "bar"]});
    });

    t.test("converts URLSearchParams", function(t) {
      let params = new URLSearchParams({foo: "bar"});
      t.same(formToObject(params), {foo: "bar"});
    });
  });
});
