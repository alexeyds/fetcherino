import jutest from "jutest";
import ContentTypes from "content_type/types";

jutest("ContentTypes", function(t) {
  t.describe(".formData", function(t) {
    t.test("builds form data content-type", function(t) {
      let boundary = "----12345";
      let type = ContentTypes.formData({boundary});

      t.equal(type, `multipart/form-data; boundary=${boundary}`);
    });
  });

  t.describe(".formUrlEncoded", function(t) {
    t.test("builds x-www-form content-type", function(t) {
      t.equal(ContentTypes.formUrlEncoded(), "application/x-www-form-urlencoded");
    });

    t.test("accepts charset", function(t) {
      let type = ContentTypes.formUrlEncoded({charset: "UTF-8"});
      t.equal(type, "application/x-www-form-urlencoded;charset=UTF-8");
    });
  });

  t.describe(".text", function(t) {
    t.test("builds text content-type", function(t) {
      t.equal(ContentTypes.text(), "text/plain");
    });

    t.test("accepts charset", function(t) {
      let type = ContentTypes.text({charset: "UTF-8"});
      t.equal(type, "text/plain;charset=UTF-8");
    });
  });

  t.describe("json", function(t) {
    t.test("returns json content-type", function(t) {
      t.equal(ContentTypes.json(), "application/json");
    });
  });
});
