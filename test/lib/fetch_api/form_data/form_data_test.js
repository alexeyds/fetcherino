import test from "enhanced-tape";
import FormData from "fetch_api/form_data";

test("FormData", function(t) {
  t.setup(() => {
    return { fd: new FormData() };
  });

  t.test("#getAll", function(t) {
    t.test("returns empty array by default", async function(t, {fd}) {
      t.same(fd.getAll("foo"), []);
    });
  });

  t.test("delegated methods", function(t) {
    t.test("implements MultiMap interface", function(t, {fd}) {
      fd.append("foo", "bar");
      t.same(fd.getAll("foo"), ["bar"]);
      t.equal(fd.has("foo"), true);

      fd.delete("foo");
      t.same(fd.getAll("foo"), []);
      t.equal(fd.has("bar"), false);

      fd.append("foo", "bar");
      fd.set("foo", "baz");
      t.same(fd.getAll("foo"), ["baz"]);

      t.same(Array.from(fd.entries()), [["foo", "baz"]]);
      t.same(Array.from(fd.values()), ["baz"]);
      t.same(Array.from(fd.keys()), ["foo"]);
    });

    t.test("converts names of stored items to strings", function(t, {fd}) {
      t.throws(() => fd.append(Symbol.iterator, "test"), /Symbol/);
    });

    t.test("converts values of stored items to strings", function(t, {fd}) {
      fd.append("foo", undefined);

      t.same(fd.getAll("foo"), ["undefined"]);
    });
  });

  t.test("#get", function(t) {
    t.test("delegates to #getFirst", function(t, {fd}) {
      fd.append("foo", "bar");
      fd.append("foo", "baz");

      t.same(fd.get("foo"), "bar");
    });
  });

  t.test("other properties", function(t) {
    t.test("has Symbol.iterator property", function(t, {fd}) {
      fd.append("foo", "bar");

      let result = Array.from(fd);

      t.same(result, [["foo", "bar"]]);
    });

    t.test("has Symbol.toStringTag property", function(t, {fd}) {
      t.equal(fd.toString(), "[object FormData]");
    });
  });
});
