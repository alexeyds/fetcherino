import test from "enhanced-tape";
import { buildFetch } from "dist/fetcherino";

test("README test", function(t) {
  t.test("fetch", function(t) {
    let fetch = buildFetch();

    t.throws(() => {
      fetch("/");
    }, /mock/);
  
    t.end();
  });
});