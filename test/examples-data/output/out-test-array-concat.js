a =  [ 6, 5 + 3i, 9 - i ]
b is of length:  [ 6, 5 + 3i, 9 - i, length ]
b =  (...args) => {
    const concatArray = this.indexArray.map(index => this._call(index));
    for (const arg of args) {
      if (arg instanceof ArrayFunctionObject) {
        for (const index of arg.indexArray) {
          concatArray.push(arg._call(index));
        }
      } else {
        concatArray.push(arg);
      }
    }
    return new ArrayFunctionObject(...concatArray);
  }
