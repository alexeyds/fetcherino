import test from "enhanced-tape";
import MultiMap from "fetch_api/multi_map";
import { delegateToMultiMap } from "fetch_api/multi_map/delegators";

test("delegateToMultiMap", function(t) {
  t.test("builds delegator function", function(t) {
    let map = new MultiMap();
    let getAll = delegateToMultiMap("getAll", {getMap: () => map});

    map.append("foo", "bar");
    t.same(getAll("foo"), ["bar"]);
  
    t.end();
  });

  t.test("accepts {convertName} option", function(t) {
    let map = new MultiMap();
    let convertName = (name) => `new_${name}`;
    let append = delegateToMultiMap("append", {getMap: () => map, convertName});

    append("foo", "bar");
    t.same(map.getAll("new_foo"), ["bar"]);
  
    t.end();
  });

  t.test("accepts {convertValue} option", function(t) {
    let map = new MultiMap();
    let convertValue = (name) => `new_${name}`;
    let append = delegateToMultiMap("append", {getMap: () => map, convertValue});

    append("foo", "bar");
    t.same(map.getAll("foo"), ["new_bar"]);
  
    t.end();
  });

  t.test("executes {getMap} in `this` context", async function(t) {
    let map = new MultiMap();
    let getMap = function() { return this.map; };
    let getAll = delegateToMultiMap("getAll", {getMap});

    map.append("foo", "bar");
    t.same(getAll.call({map}, "foo"), ["bar"]);
  
    t.end();
  });
});
