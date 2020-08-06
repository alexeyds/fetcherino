import uniq from "lodash.uniq";
import Entry from "./entry";

export default class FormData {
  constructor() {
    this._entriesList = [];
    this[Symbol.iterator] = this.entries;
    this[Symbol.toStringTag] = "FormData";
  }

  append(name, value) {
    let entry = new Entry({name, value});
    this._entriesList.push(entry);
  }

  get(name) {
    let entry = this._entriesList.find(e => e.isNameEqual(name));

    return entry ? entry.value : null;
  }

  getAll(name) {
    return this._entriesList.filter(e => e.isNameEqual(name)).map(e => e.value);
  }

  delete(name) {
    this._entriesList = this._entriesList.filter(e => !e.isNameEqual(name));
  }

  set(name, value) {
    this.delete(name);
    this.append(name, value);
  }

  has(name) {
    return this.get(name) !== null;
  }

  *entries() {
    for (let entry of this._entriesList) {
      yield [entry.name, entry.value];
    }
  }

  *values() {
    for (let entry of this._entriesList) {
      yield entry.value;
    }
  }

  *keys() { 
    let keys = uniq(this._entriesList.map(e => e.name));
    for (let key of keys) {
      yield key;
    }
  }
}
