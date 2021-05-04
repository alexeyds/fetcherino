import jutest from "jutest";
import MultiMap from "fetch_api/multi_map";

jutest("MultiMap", function(t) {
  t.describe("#getAll", function(t) {
    t.test("returns null", function(t) {
      let map = new MultiMap();

      t.same(map.getAll("foo"), null);
    });

    t.test("returns all values for given key", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");

      t.same(map.getAll("foo"), ["bar", "baz"]);
    });

    t.test("matches entries by key", async function(t) {
      let map = new MultiMap();
      map.append("bar", "baz");
      map.append("foo", "bar");

      t.same(map.getAll("foo"), ["bar"]);
    });
  });

  t.describe("#getFirst", function(t) {
    t.test("returns null", function(t) {
      let map = new MultiMap();

      t.equal(map.getFirst("foo"), null);
    });

    t.test("returns first appended value", async function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");

      t.equal(map.getFirst("foo"), "bar");
    });
  });

  t.describe("#has", function(t) {
    t.test("false if map has no such key", function(t) {
      let map = new MultiMap();

      t.equal(map.has("foo"), false);
    });

    t.test("true if map has a key", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");

      t.equal(map.has("foo"), true);
    });
  });

  t.describe("#delete", function(t) {
    t.test("does nothing", function(t) {
      let map = new MultiMap();
      map.delete("foo");

      t.equal(map.has("foo"), false);
    });

    t.test("removes entries", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.delete("foo");

      t.equal(map.has("foo"), false);
    });

    t.test("removes matching entries only", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.delete("baz");

      t.equal(map.has("baz"), false);
      t.same(map.getAll("foo"), ["bar"]);
    });
  });

  t.describe("#set", function(t) {
    t.test("adds entry", function(t) {
      let map = new MultiMap();
      map.set("foo", "bar");

      t.same(map.getAll("foo"), ["bar"]);
    });

    t.test("overwrites all entries with same name", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.set("foo", "123");

      t.same(map.getAll("foo"), ["123"]);
    });
  });

  t.describe("#entries", function(t) {
    t.test("returns entries iterator", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.append("bar", "baz");

      let result = Array.from(map.entries());

      t.same(result, [["foo", "bar"], ["foo", "baz"], ["bar", "baz"]]);
    });
  });

  t.describe("#values", function(t) {
    t.test("returns values iterator", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");

      let result = Array.from(map.values());

      t.same(result, ["bar", "baz"]);
    });
  });

  t.describe("#keys", function(t) {
    t.test("returns keys iterator", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");

      let result = Array.from(map.keys());

      t.same(result, ["foo"]);
    });

    t.test("iterates over unique keys only", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "bar");

      let result = Array.from(map.keys());

      t.same(result, ["foo"]);
    });
  });
});
