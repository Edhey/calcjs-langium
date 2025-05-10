(...args) => {
      let auxFunction = currentFunction;
      if (cacheArgument == null) {
        throw new Error("Invalid null argument on the left side of the assignment");
      }
      let equal = false;
      try {
        args[0]?.equals(cacheArgument);
        equal = args[0].equals(cacheArgument);
      } catch (e) {
        equal = args[0] === cacheArgument;
      }
      if (equal) {
        if (cacheArgs.length === index + 1) {
          return cacheValue;
        }
        auxFunction = currentFunction(...args);
        return this._assing(auxFunction, cacheArgs, cacheValue, index + 1);
      }
      return currentFunction(...args);
    }
(...args) => {
      let auxFunction = currentFunction;
      if (cacheArgument == null) {
        throw new Error("Invalid null argument on the left side of the assignment");
      }
      let equal = false;
      try {
        args[0]?.equals(cacheArgument);
        equal = args[0].equals(cacheArgument);
      } catch (e) {
        equal = args[0] === cacheArgument;
      }
      if (equal) {
        if (cacheArgs.length === index + 1) {
          return cacheValue;
        }
        auxFunction = currentFunction(...args);
        return this._assing(auxFunction, cacheArgs, cacheValue, index + 1);
      }
      return currentFunction(...args);
    }
(...args) => {
      let auxFunction = currentFunction;
      if (cacheArgument == null) {
        throw new Error("Invalid null argument on the left side of the assignment");
      }
      let equal = false;
      try {
        args[0]?.equals(cacheArgument);
        equal = args[0].equals(cacheArgument);
      } catch (e) {
        equal = args[0] === cacheArgument;
      }
      if (equal) {
        if (cacheArgs.length === index + 1) {
          return cacheValue;
        }
        auxFunction = currentFunction(...args);
        return this._assing(auxFunction, cacheArgs, cacheValue, index + 1);
      }
      return currentFunction(...args);
    }
function($y) {
return $x.add($y);
}
