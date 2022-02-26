export default class Batch {
  constructor(batchData) {
    Object.entries(batchData).map(e => this.assign(e[0], e[1]));
  }

  assign(key, value) {
    if (this[`${key}!`] === undefined) {
      this[key] = value;
    }
    else {
      this[key] = value;
    }
  }

  read(key) {
    let value = this[`${key}!`];
    if (value === undefined) {
      value = this[key];
    }
    return value;
  }

  simplify() {
    return {
      ...Object.fromEntries(Object.entries(this).filter(e => !e[0].endsWith('!'))),
      ...Object.fromEntries(Object.entries(this).filter(e => e[0].endsWith('!')).map(e => [e[0].replace('!', ''), e[1]])),
    };
  }
}
