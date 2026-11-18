/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Thu 27 Mar 2025
 * @desc This file defines the FunctionObject class, which is a subclass of the 
 * CallableInstance class.
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

import { FunctionObject } from "./function-object.js";
import { Complex } from 'complex.js';

class ArrayFunctionObject extends FunctionObject {
  constructor(...array) {
    const arrayInitialFunction = (index) => null;
    super(arrayInitialFunction);
    this.indexArray = [];
    for (let i = 0; i < array.length; i++) {
      i = new Complex(i);
      const value = (typeof array[i] !== "number") ? array[i] : new Complex(array[i]);
      this.assign([i], value);
    }
    this.wrappedFunction = this._assing(this.wrappedFunction, ['concat'], this.concat, 0);
    this.wrappedFunction = this._assing(this.wrappedFunction, ['length'], this.getLength, 0);
    this.wrappedFunction = this._assing(this.wrappedFunction, ['push'], this.push, 0);
    this.inmediatFunctions = ['length'];
  }

  toString() {
    let output = "[ ";
    for (const index of this.indexArray) {
      const value = this._call(index);
      output += (value ? value.toString() : "null") + ", ";
    }
    return output.slice(0, -2) + " ]";
  }

  _call(index) {
    if (this.inmediatFunctions.includes(index)) {
      return this.wrappedFunction(index)();
    }
    return this.wrappedFunction(index);
  }

  assign(cacheArgs, cacheValue) {
    if (cacheArgs.length === 0) {
      throw new Error("Invalid assignment of an empty array");
    }
    if (!cacheArgs.every(arg => arg instanceof Complex)) {
      throw new Error("Cannot use non numeric values in the index of an array");
    }
    if (!cacheArgs.every(arg => arg.re >= 0 && arg.im === 0)) {
      throw new Error("The index of an array must be a positive integer");
    }
    for (const arg of cacheArgs) {
      if (!this.indexArray.some(index => index.equals(arg))) {
        this.indexArray.push(arg);
      }
    }
    let currentFunction = this.wrappedFunction;
    this.wrappedFunction = this._assing(currentFunction, cacheArgs, cacheValue, 0);
    return this; // TODO: Devolver this? wrappedFunction? nada?
  }

  _assing(currentFunction, cacheArgs, cacheValue, index) {
    let cacheArgument = cacheArgs[index];

    return (...args) => {
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
    };
  }

  concat = (...args) => {
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

  getLength = () => {
    return this.indexArray.length;
  }

  push = (arg) => {
    const lastIndex = this.indexArray.length;
    if (arg instanceof ArrayFunctionObject) {
      for (const index of arg.indexArray) {
        this.indexArray.push(arg._call(lastIndex));
      }
    } else {
      this.indexArray.push(new Complex(lastIndex));
      this.wrappedFunction = this._assing(this.wrappedFunction, [new Complex(lastIndex)], arg, 0);
    }

  }
}

function arrayObject(...array) {
  return new ArrayFunctionObject(...array);
}

export { ArrayFunctionObject, arrayObject };