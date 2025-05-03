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
  constructor(rawFunction) {
    super("_call");
    this.rawFunction = rawFunction;
    this.wrappedFunction = rawFunction;
    this.cache = new StoreMap();
  }

  _call(arg) {
    return this.wrappedFunction(arg) ?? null;
  }

  toFunction() {
    return this.wrappedFunction;
  }

  toString() {
    return this.wrappedFunction.toString();
  }

  /**
 * For the given function, assign the function call with the arguments provided 
 * to the value especified in the parameter cacheValue.
 * @param {FunctionObject} otherFunction It the function (callableInstance) 
 * to be assigned.
 * @param {Array} cacheArgs The arguments to be assigned to the function.
 * @param {Array} cacheValue The value to be assigned to the function in the 
 * call with the arguments provided.   
 */
  assign(cacheArgs, cacheValue) {
    if (cacheArgs.length === 0) {
      throw new Error("Invalid empty argument on the left side of the assignment");
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
}

/** 
 * @description This function creates a new FunctionObject instance if the
 * provided argument is not an instance of FunctionObject. Otherwise, it returns
 * the provided argument.
 * @param {FunctionObject} rawFunction - The function to be wrapped.
 * @returns {FunctionObject} - The FunctionObject instance.
 */
function functionObject(rawFunction) {
  if (rawFunction instanceof FunctionObject) return rawFunction;
  return new FunctionObject(rawFunction);
}

export { FunctionObject, functionObject };