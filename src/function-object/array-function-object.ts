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
 * @see {@link https://github.com/Edhey/calcjs-langium}
 */

import { FunctionObject } from "./function-object.js";
import { Complex } from 'complex.js';
import type { Complex as ComplexInstance } from 'complex.js';

type CallableValue = unknown;

class ArrayFunctionObject extends FunctionObject {
  indexArray: ComplexInstance[];
  inmediatFunctions: string[];

  constructor(...array: CallableValue[]) {
    const arrayInitialFunction = (..._args: unknown[]) => null;
    super(arrayInitialFunction);
    this.indexArray = [];
    for (let i = 0; i < array.length; i++) {
      const complexIndex = new Complex(i);
      const value = (typeof array[i] !== "number") ? array[i] : new Complex(array[i] as number);
      this.assign([complexIndex], value);
    }
    this.wrappedFunction = this._assing(this.wrappedFunction, ['concat'], this.concat, 0);
    this.wrappedFunction = this._assing(this.wrappedFunction, ['length'], this.getLength, 0);
    this.wrappedFunction = this._assing(this.wrappedFunction, ['push'], this.push, 0);
    this.inmediatFunctions = ['length'];
  }

  override toString(): string {
    let output = "[ ";
    for (const index of this.indexArray) {
      const value = this._call(index);
      output += (value ? value.toString() : "null") + ", ";
    }
    return output.slice(0, -2) + " ]";
  }

  override _call(index: unknown): unknown {
    if (typeof index === 'string' && this.inmediatFunctions.includes(index)) {
      const immediate = this.wrappedFunction(index);
      if (typeof immediate === 'function') {
        return immediate();
      }
      return immediate;
    }
    return this.wrappedFunction(index);
  }

  override assign(cacheArgs: unknown[], cacheValue: unknown): this {
    if (cacheArgs.length === 0) {
      throw new Error("Invalid assignment of an empty array");
    }
    if (!cacheArgs.every(arg => arg instanceof Complex)) {
      throw new Error("Cannot use non numeric values in the index of an array");
    }
    if (!cacheArgs.every(arg => arg instanceof Complex && arg.re >= 0 && arg.im === 0)) {
      throw new Error("The index of an array must be a positive integer");
    }
    for (const arg of cacheArgs as ComplexInstance[]) {
      if (!this.indexArray.some(index => index.equals(arg))) {
        this.indexArray.push(arg);
      }
    }
    const currentFunction = this.wrappedFunction;
    this.wrappedFunction = this._assing(currentFunction, cacheArgs, cacheValue, 0);
    return this;
  }

  _assing(currentFunction: (arg: unknown) => unknown, cacheArgs: unknown[], cacheValue: unknown, index: number): (arg: unknown) => unknown {
    const cacheArgument = cacheArgs[index];

    return (...args: unknown[]) => {
      let auxFunction = currentFunction;
      if (cacheArgument == null) {
        throw new Error("Invalid null argument on the left side of the assignment");
      }
      let equal = false;
      try {
        const candidate = args[0] as { equals?: (value: unknown) => boolean } | undefined;
        candidate?.equals?.(cacheArgument);
        equal = candidate?.equals?.(cacheArgument) === true;
      } catch {
        equal = args[0] === cacheArgument;
      }
      if (equal) {
        if (cacheArgs.length === index + 1) {
          return cacheValue;
        }
        auxFunction = currentFunction(args[0]) as (arg: unknown) => unknown;
        return this._assing(auxFunction, cacheArgs, cacheValue, index + 1);
      }
      return currentFunction(args[0]);
    };
  }

  concat = (...args: unknown[]): ArrayFunctionObject => {
    const concatArray: unknown[] = this.indexArray.map(index => this._call(index));
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
  };

  getLength = (): number => this.indexArray.length;

  push = (arg: unknown): void => {
    const lastIndex = this.indexArray.length;
    if (arg instanceof ArrayFunctionObject) {
      for (let i = 0; i < arg.indexArray.length; i++) {
        this.indexArray.push(arg._call(lastIndex) as ComplexInstance);
      }
    } else {
      this.indexArray.push(new Complex(lastIndex));
      this.wrappedFunction = this._assing(this.wrappedFunction, [new Complex(lastIndex)], arg, 0);
    }
  };
}

function arrayObject(...array: CallableValue[]): ArrayFunctionObject {
  return new ArrayFunctionObject(...array);
}

export { ArrayFunctionObject, arrayObject };
