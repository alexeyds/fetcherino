import test from "enhanced-tape";
import Entry from "fetch_api/form_data/entry";

test("FormData Entry", function(t) {
  t.test("constructor", function(t) {
    t.test("accepts {name, value}", function(t) {
      let entry = new Entry({name: "foo", value: "bar"});

      t.equal(entry.name, "foo");
      t.equal(entry.value, "bar");

      t.end();
    });

    t.test("converts name and value to strings", function(t) {
      let entry = new Entry({name: 1, value: 2});

      t.equal(entry.name, "1");
      t.equal(entry.value, "2");
    
      t.end();
    });
  });

  t.test("#isNameEqual", function(t) {
    t.test("false if name is not equal", function(t) {
      let entry = new Entry({name: "foo", value: "bar"});

      t.equal(entry.isNameEqual("bar"), false);
  
      t.end();
    });

    t.test("true if name is equal", function(t) {
      let entry = new Entry({name: "foo", value: "bar"});

      t.equal(entry.isNameEqual("foo"), true);
  
      t.end();
    });

    t.test("converts expected name to string", function(t) {
      let entry = new Entry({name: "1", value: "bar"});

      t.equal(entry.isNameEqual(1), true);
  
      t.end();
    });
  });
});
