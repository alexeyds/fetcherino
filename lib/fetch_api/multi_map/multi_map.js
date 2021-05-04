export default class MultiMap {
  constructor({ caseInsensitiveKeys=false }={}) {
    this._entries = {};
    this._caseInsensitiveKeys = caseInsensitiveKeys;
  }

  append(key, value) {
    if (this.has(key)) {
      this._entries[key].push(value);
    } else {
      this._entries[key] = [value];
    }
  }

  getFirst(key) {
    let entriesOrNull = this.getAll(key);
    return entriesOrNull ? entriesOrNull[0] : entriesOrNull;
  }

  getAll(key) {
    if (this.has(key)) {
      return this._entries[key];
    } else {
      return null;
    }
  }

  has(key) {
    return key in this._entries;
  }

  delete(key) {
    delete this._entries[key];
  }

  set(key, value) {
    this.delete(key);
    this.append(key, value);
  }

  *entries() {
    for (let key in this._entries) {
      for (let value of this._entries[key]) {
        yield [key, value];
      }
    }
  }

  *values() {
    for (let [, value] of this.entries()) {
      yield value;
    }
  }

  *keys() {
    for (let key in this._entries) {
      yield key;
    }
  }

  _key(key) {
    return key.toLowerCase();
  }
}