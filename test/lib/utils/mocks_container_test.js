import test from "enhanced-tape";
import MocksContainer from "utils/mocks_container";

test("MocksContainer", function(t) {
  t.test("#all", function(t) {
    t.test("returns [] if no mocks are added", function(t) {
      let mocks = new MocksContainer();

      t.same(mocks.all(), []);
  
      t.end();
    });
  });

  t.test("#add", function(t) {
    t.test("adds mock to list", function(t) {
      let mocks = new MocksContainer();
      mocks.add("foo");
      mocks.add("bar");

      t.same(mocks.all(), ["foo", "bar"]);
  
      t.end();
    });
  });

  t.test("#takeFirstBy", function(t) {
    t.test("returns null if element is not found", function(t) {
      let mocks = new MocksContainer();
      mocks.add("foo");

      t.equal(mocks.takeFirstBy(() => false), null);
  
      t.end();
    });

    t.test("returns first matched element", function(t) {
      let mocks = new MocksContainer();
      mocks.add("bar");
      mocks.add("foo");

      t.equal(mocks.takeFirstBy((i) => i === "foo"), "foo");
    
      t.end();
    });

    t.test("removes first matched element", function(t) {
      let mocks = new MocksContainer();
      mocks.add("bar");
      mocks.add("foo");
      mocks.add("baz");

      mocks.takeFirstBy((i) => i === "foo");

      t.same(mocks.all(), ["bar", "baz"]);
    
      t.end();
    });
  });
});