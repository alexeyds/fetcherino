import MultiMap from "fetch_api/multi_map";
import { delegateToMultiMap } from "fetch_api/multi_map/delegators";

export default class Headers {
  constructor(init={}) {
    this._multiMap = new MultiMap();
    this[Symbol.iterator] = this.entries;
    this[Symbol.toStringTag] = "Headers";

    populateHeaders(this, init);
  }

  forEach(callback) {
    for (let [k, v] of this) {
      callback(v, k);
    }
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

function populateHeaders(headers, init) {
  if (isHeaders(init)) {
    init.forEach((v, k) => headers.append(k, v));
  } else if (Array.isArray(init)) {
    for (let pair of init) {
      headers.append(pair[0], pair[1]);
    }
  } else {  
    for (let k in init) {
      headers.append(k, init[k]);
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

export function isHeaders(obj) {
  return obj ? obj.constructor.name === "Headers" : false;
}