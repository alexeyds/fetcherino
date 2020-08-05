import test from "enhanced-tape";
import FormData from "fetch_api/form_data";

test("FormData", function(t) {
  t.test("#append", function(t) {
    t.test("accepts entry name and value", function(t) {
      let fd = new FormData();

      t.equal(fd.append("foo", "bar"), undefined);

      t.end();
    });

    t.test("doen't overwrite existing values with same name", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      fd.append("foo", "baz");

      t.same(fd.getAll("foo"), ["bar", "baz"]);
    
      t.end();
    });

    t.test("converts name and value to strings", function(t) {
      let fd = new FormData();
      fd.append(1, 2);

      t.same(Array.from(fd.entries()), [["1", "2"]]);
    
      t.end();
    });
  });

  t.test("#get", function(t) {
    t.test("returns null", function(t) {
      let fd = new FormData();

      t.equal(fd.get("foo"), null);
  
      t.end();
    });

    t.test("returns first matching entry's value", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      fd.append("bar", "foo");

      t.equal(fd.get("foo"), "bar");
    
      t.end();
    });

    t.test("does not distinguish between non-string names", function(t) {
      let fd = new FormData();
      fd.append("1", "bar");

      t.equal(fd.get(1), "bar");
    
      t.end();
    });
  });

  t.test("#getAll", function(t) {
    t.test("returns empty array", function(t) {
      let fd = new FormData();

      t.same(fd.getAll("foo"), []);
  
      t.end();
    });

    t.test("returns values of all matching entries", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      fd.append("bar", "foo");

      t.same(fd.getAll("foo"), ["bar"]);
    
      t.end();
    });
  });

  t.test("#delete", function(t) {
    t.test("does nothing", function(t) {
      let fd = new FormData();

      t.equal(fd.delete("foo"), undefined);
    
      t.end();
    });

    t.test("removes all entries with matching name", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      fd.append("foo", "baz");
      fd.delete("foo");

      t.same(fd.getAll("foo"), []);
  
      t.end();
    });

    t.test("removes matching entries only", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      fd.delete("baz");

      t.same(fd.getAll("foo"), ["bar"]);
  
      t.end();
    });
  });

  t.test("#set", function(t) {
    t.test("accepts entry name and value", function(t) {
      let fd = new FormData();

      t.equal(fd.set("foo", "bar"), undefined);

      t.end();
    });

    t.test("adds entry", function(t) {
      let fd = new FormData();
      fd.set("foo", "bar");

      t.equal(fd.get("foo"), "bar");

      t.end();
    });

    t.test("overwrites all entries with same name", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      fd.append("foo", "baz");
      fd.set("foo", "123");

      t.same(fd.getAll("foo"), ["123"]);

      t.end();
    });
  });

  t.test("#has", function(t) {
    t.test("returns false if there is no matching entry", function(t) {
      let fd = new FormData();
      fd.append("bar", "baz");

      t.equal(fd.has("foo"), false);
  
      t.end();
    });

    t.test("returns true if there is a matching entry", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");

      t.equal(fd.has("foo"), true);
  
      t.end();
    });
  });

  t.test("#entries", function(t) {
    t.test("returns entries iterator", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");

      let result = Array.from(fd.entries());

      t.same(result, [["foo", "bar"]]);
  
      t.end();
    });
  });

  t.test("#values", function(t) {
    t.test("returns values iterator", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");

      let result = Array.from(fd.values());

      t.same(result, ["bar"]);
  
      t.end();
    });
  });

  t.test("#keys", function(t) {
    t.test("returns keys iterator", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");

      let result = Array.from(fd.keys());

      t.same(result, ["foo"]);
  
      t.end();
    });

    t.test("iterates over unique keys only", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");
      fd.append("foo", "bar");

      let result = Array.from(fd.keys());

      t.same(result, ["foo"]);
  
      t.end();
    });
  });

  t.test("[Symbol.iterator]", function(t) {
    t.test("is iterable on its own", function(t) {
      let fd = new FormData();
      fd.append("foo", "bar");

      let result = Array.from(fd);

      t.same(result, [["foo", "bar"]]);
  
      t.end();
    });
  });
});
