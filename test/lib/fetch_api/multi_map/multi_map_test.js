import test from "enhanced-tape";
import MultiMap from "fetch_api/multi_map";

test("MultiMap", function(t) {
  t.test("#getAll", function(t) {
    t.test("returns null", function(t) {
      let map = new MultiMap();

      t.same(map.getAll("foo"), null);
  
      t.end();
    });

    t.test("returns all values for given key", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");

      t.same(map.getAll("foo"), ["bar", "baz"]);
    
      t.end();
    });

    t.test("matches entries by key", async function(t) {
      let map = new MultiMap();
      map.append("bar", "baz");
      map.append("foo", "bar");

      t.same(map.getAll("foo"), ["bar"]);
    
      t.end();
    });
  });

  t.test("#getFirst", function(t) {
    t.test("returns null", function(t) {
      let map = new MultiMap();

      t.equal(map.getFirst("foo"), null);
  
      t.end();
    });

    t.test("returns first appended value", async function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");

      t.equal(map.getFirst("foo"), "bar");
    
      t.end();
    });
  });

  t.test("#has", function(t) {
    t.test("false if map has no such key", function(t) {
      let map = new MultiMap();

      t.equal(map.has("foo"), false);
  
      t.end();
    });

    t.test("true if map has a key", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");

      t.equal(map.has("foo"), true);
  
      t.end();
    });
  });

  t.test("#delete", function(t) {
    t.test("does nothing", function(t) {
      let map = new MultiMap();
      map.delete("foo");

      t.equal(map.has("foo"), false);
    
      t.end();
    });

    t.test("removes entries", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.delete("foo");

      t.equal(map.has("foo"), false);
  
      t.end();
    });

    t.test("removes matching entries only", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.delete("baz");

      t.equal(map.has("baz"), false);
      t.same(map.getAll("foo"), ["bar"]);
  
      t.end();
    });
  });

  t.test("#set", function(t) {
    t.test("adds entry", function(t) {
      let map = new MultiMap();
      map.set("foo", "bar");

      t.same(map.getAll("foo"), ["bar"]);

      t.end();
    });

    t.test("overwrites all entries with same name", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.set("foo", "123");

      t.same(map.getAll("foo"), ["123"]);

      t.end();
    });
  });

  t.test("#entries", function(t) {
    t.test("returns entries iterator", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");
      map.append("bar", "baz");

      let result = Array.from(map.entries());

      t.same(result, [["foo", "bar"], ["foo", "baz"], ["bar", "baz"]]);
  
      t.end();
    });
  });

  t.test("#values", function(t) {
    t.test("returns values iterator", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "baz");

      let result = Array.from(map.values());

      t.same(result, ["bar", "baz"]);
  
      t.end();
    });
  });

  t.test("#keys", function(t) {
    t.test("returns keys iterator", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");

      let result = Array.from(map.keys());

      t.same(result, ["foo"]);
  
      t.end();
    });

    t.test("iterates over unique keys only", function(t) {
      let map = new MultiMap();
      map.append("foo", "bar");
      map.append("foo", "bar");

      let result = Array.from(map.keys());

      t.same(result, ["foo"]);
  
      t.end();
    });
  });
});
