import test from "enhanced-tape";
import { mockFetch } from "fetcherino";

test("mockFetch", function(t) {
  t.test("throws on unmocked fetch attempt", function(t) {
    let fetch = mockFetch();

    t.throws(() => {
      fetch("test.com");
    }, /mock/);

    t.end();
  });
});