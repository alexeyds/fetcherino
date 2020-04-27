export default class MocksContainer {
  constructor() {
    this._mocksArr = [];
  }

  all() {
    return this._mocksArr;
  }

  add(mock) {
    this._mocksArr.push(mock);
  }

  takeFirstBy(matcher) {
    let index = this._mocksArr.findIndex(matcher);
    
    if (index === -1) {    
      return null;
    } else {
      let item = this._mocksArr[index];
      this._mocksArr.splice(index, 1);

      return item;
    }
  }
}