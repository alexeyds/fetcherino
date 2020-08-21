import MultiMap from "fetch_api/multi_map";
import { delegateToMultiMap } from "fetch_api/multi_map/delegators";

export default class FormData {
  constructor() {
    this._multiMap = new MultiMap();
    this[Symbol.iterator] = this.entries;
    this[Symbol.toStringTag] = "FormData";
  }
}

let delegatorConfig = {
  getMap: function() { return this._multiMap; },
  convertName: (val) => `${val}`,
  convertValue: (val) => `${val}`
};

["append", "delete", "has", "set", "entries", "values", "keys"].forEach(method => {
  FormData.prototype[method] = delegateToMultiMap(method, delegatorConfig);
});

FormData.prototype.get = delegateToMultiMap("getFirst", delegatorConfig);

FormData.prototype.getAll = function() {
  let delegate = delegateToMultiMap("getAll", delegatorConfig);
  return delegate.call(this, ...arguments) || [];
};
