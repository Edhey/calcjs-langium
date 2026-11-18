/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @desc This file defines the FunctionObject class, which is a subclass of the 
 * CallableInstance class.
 */

// @ts-ignore
import CallableInstance from 'callable-instance';
import { StoreMap } from './store-map.js';

/**
 * @class FunctionObject
 * @extends CallableInstance
 * @description This class represents a function object that can be called with
 * arguments. It extends the CallableInstance class and provides a way to cache
 * the results of function calls for specific arguments.
 */
class FunctionObject extends CallableInstance {
  rawFunction: (arg: any) => any;
  wrappedFunction: (arg: any) => any;
  cache: StoreMap<any, any>;

  constructor(rawFunction: (arg: any) => any) {
    super("_call");
    this.rawFunction = rawFunction;
    this.wrappedFunction = rawFunction;
    this.cache = new StoreMap();
  }

  _call(arg: any): any {
    return this.wrappedFunction(arg) ?? null;
  }

  toFunction(): (arg: any) => any {
    return this.wrappedFunction;
  }

  override toString(): string {
    return this.wrappedFunction.toString();
  }

  /**
   * For the given function, assign the function call with the arguments provided 
   * to the value specified in the parameter cacheValue.
   * @param cacheArgs The arguments to be assigned to the function.
   * @param cacheValue The value to be assigned to the function in the 
   * call with the arguments provided.   
   */
  assign(cacheArgs: any[], cacheValue: any): this {
    if (cacheArgs.length === 0) {
      throw new Error("Invalid empty argument on the left side of the assignment");
    }
    const currentFunction = this.wrappedFunction;
    this.wrappedFunction = this._assign(currentFunction, cacheArgs, cacheValue, 0);
    return this;
  }

  private _assign(
    currentFunction: (arg: any) => any,
    cacheArgs: any[],
    cacheValue: any,
    index: number
  ): (arg: any) => any {
    const cacheArgument = cacheArgs[index];

    return (...args: any[]) => {
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
        auxFunction = currentFunction(args); // TODO: Check ...args
        return this._assign(auxFunction, cacheArgs, cacheValue, index + 1);
      }
      return currentFunction(args); // TODO: Check ...args
    };
  }
}

/** 
 * @description This function creates a new FunctionObject instance if the
 * provided argument is not an instance of FunctionObject. Otherwise, it returns
 * the provided argument.
 * @param rawFunction - The function to be wrapped.
 * @returns The FunctionObject instance.
 */
function functionObject(rawFunction: (arg: any) => any): FunctionObject {
  if (rawFunction instanceof FunctionObject) return rawFunction;
  return new FunctionObject(rawFunction);
}

export { FunctionObject, functionObject };