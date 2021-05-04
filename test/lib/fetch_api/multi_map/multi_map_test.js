import jutest from "jutest";
import MultiMap from "fetch_api/multi_map";

jutest("MultiMap", s => {
  s.setup(() => {
    return { map: new MultiMap() };
  });

  s.describe("#getAll", s => {
    s.test("returns null", (t, { map }) => {
      t.same(map.getAll("foo"), null);
    });

    s.test("returns all values for given key", (t, { map }) => {
      map.append("foo", "bar");
      map.append("foo", "baz");

      t.same(map.getAll("foo"), ["bar", "baz"]);
    });

    s.test("matches entries by key", async (t, { map }) => {
      map.append("bar", "baz");
      map.append("foo", "bar");

      t.same(map.getAll("foo"), ["bar"]);
    });
  });

  s.describe("#getFirst", s => {
    s.test("returns null", (t, { map }) => {
      t.equal(map.getFirst("foo"), null);
    });

    s.test("returns first appended value", async (t, { map }) => {
      map.append("foo", "bar");
      map.append("foo", "baz");

      t.equal(map.getFirst("foo"), "bar");
    });
  });

  s.describe("#has", s => {
    s.test("returns false if map has no such key", (t, { map }) => {
      map.append("FOO", 'bar');
      t.equal(map.has("foo"), false);
    });

    s.test("returns true if key is present", (t, { map }) => {
      map.append("foo", "bar");
      t.equal(map.has("foo"), true);
    });
  });

  s.describe("#delete", s => {
    s.test("does nothing", (t, { map }) => {
      map.delete("foo");
      t.equal(map.has("foo"), false);
    });

    s.test("removes entries", (t, { map }) => {
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.delete("foo");

      t.equal(map.has("foo"), false);
    });

    s.test("removes matching entries only", (t, { map }) => {
      map.append("foo", "bar");
      map.delete("baz");

      t.equal(map.has("baz"), false);
      t.same(map.getAll("foo"), ["bar"]);
    });
  });

  s.describe("#set", s => {
    s.test("adds entry", (t, { map }) => {
      map.set("foo", "bar");
      t.same(map.getAll("foo"), ["bar"]);
    });

    s.test("overwrites all entries with same name", (t, { map }) => {
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.set("foo", "123");

      t.same(map.getAll("foo"), ["123"]);
    });
  });

  s.describe("#entries", s => {
    s.test("returns entries iterator", (t, { map }) => {
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.append("bar", "baz");

      let result = Array.from(map.entries());

      t.same(result, [["foo", "bar"], ["foo", "baz"], ["bar", "baz"]]);
    });
  });

  s.describe("#values", s => {
    s.test("returns values iterator", (t, { map }) => {
      map.append("foo", "bar");
      map.append("foo", "baz");

      let result = Array.from(map.values());

      t.same(result, ["bar", "baz"]);
    });
  });

  s.describe("#keys", s => {
    s.test("returns keys iterator", (t, { map }) => {
      map.append("foo", "bar");

      let result = Array.from(map.keys());

      t.same(result, ["foo"]);
    });

    s.test("iterates over unique keys only", (t, { map }) => {
      map.append("foo", "bar");
      map.append("foo", "bar");

      let result = Array.from(map.keys());

      t.same(result, ["foo"]);
    });
  });
});
