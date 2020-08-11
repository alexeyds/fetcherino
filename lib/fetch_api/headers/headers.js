import MultiMap from "fetch_api/multi_map";
import { delegateToMultiMap } from "fetch_api/multi_map/delegators";

export default class Headers {
  constructor() {
    this._multiMap = new MultiMap();
    this[Symbol.iterator] = this.entries;
    this[Symbol.toStringTag] = "Headers";
  }

  *entries() {
    for (let key of this.keys()) {
      yield [key, this.get(key)];
    }
  }

  *values() {
    for (let [, value] of this.entries()) {
      yield value;
    }
  }
}

let delegatorConfig = {
  getMap: function() { return this._multiMap; },
  convertName: (val) => `${val}`.toLowerCase(),
  convertValue: (val) => `${val}`
};

["append", "delete", "has", "set", "keys"].forEach(method => {
  Headers.prototype[method] = delegateToMultiMap(method, delegatorConfig);
});

Headers.prototype.get = function() {
  let delegate = delegateToMultiMap("getAll", delegatorConfig);
  let headers = delegate.call(this, ...arguments);
  return headers && headers.join(", ");
};