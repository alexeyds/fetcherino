import jutest from "jutest";
import { capitalize } from "utils/string";

jutest("String utils", function(t) {
  t.describe("capitalize()", function(t) {
    t.test("capitalizes string", function(t) {
      t.equal(capitalize("foobar"), "Foobar");
    });
  });
});
