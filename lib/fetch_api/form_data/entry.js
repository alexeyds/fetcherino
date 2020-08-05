export default class Entry {
  constructor({name, value}) {
    this.name = name.toString();
    this.value = value.toString();
  }

  isNameEqual(name) {
    return this.name === name.toString();
  }
}