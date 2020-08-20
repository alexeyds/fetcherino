import test from "enhanced-tape";
import { capitalize } from "utils/string";

test("String utils", function(t) {
  t.test("capitalize()", function(t) {
    t.test("capitalizes string", function(t) {
      t.equal(capitalize("foobar"), "Foobar");
    });
  });
});
