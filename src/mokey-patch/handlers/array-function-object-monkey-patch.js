/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Procesadores de Lenguajes
 * Práctica 6 - While, for
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 19 Mar 2025 
 * @desc Handler for Array Function Object operations
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himarlodashedhey-hernandez-alu0101552392}
 *
 */

const { Complex } = require('complex.js');
const { ArrayFunctionObject, arrayObject } = require('../../function-object/array-function-object.js');
const { operationHandlers, implementedTypes, allOperators } = require('../monkey-patch-handlers.js');
const lodash = require('lodash');
const { re } = require('mathjs');

// Initialize the function operators in the operationHandlers
for(const operator in allOperators) {
  lodash.set(operationHandlers, `arrayfunctionobject.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(ArrayFunctionObject);

/**
 * Represents the operators that can be used in the function
 * @type {{add: string, mul: string, div: string, equals: string, pow: string, neg: string}}
 */
const Operators = {
  add: '+', mul: '*', div: '/', equals: '==', pow: '**', sub: '-', equals: '==', notEquals: '!=',
};

for (let operator in Operators) {
  /**
   * Operates the function with the function result
   * @param {Function} other It is the function to operate
   * @returns Returns a FunctionObject that operates the function with the function result
   */
  lodash.set(operationHandlers, `arrayfunctionobject.${operator}.arrayfunctionobject`, function (other) {
    try {
      const allIndex = this.indexArray.concat(other.indexArray.filter(item => !this.indexArray.some(existingItem => existingItem.equals(item))));
      const result = new ArrayFunctionObject();
      for (const index of allIndex) {
        const value1 = this._call(index) ?? new Complex(0);
        const value2 = other._call(index) ?? new Complex(0);
        const value = value1[operator](value2);
        result.assign([index], value);
      }
      return result;
    } catch (e) {
      throw new Error(`Unsupported ${operator} for function ${other}`);
    }
  });

  /**
   * Operates a function with an object. The object must be a Complex.
   * @param {Object} other It is the object to operate must be a Complex
   * @returns Returns a FunctionObject that operates the function with the object as a
   * complex
   * @throws Error if the object is not a Complex
   */
  lodash.set(operationHandlers, `arrayfunctionobject.${operator}.complex`, function (other) {
    return arrayObject((...x) => this(...x)[operator](other));
  });
}

/**
 * Function to concatenate a function with a string
 * @param {String} other It is the string to concatenate
 * @returns Returns a FunctionObject representing the concatenation of the function with the string
 */
lodash.set(operationHandlers, 'arrayfunctionobject.add.string', function (other) {
  return arrayObject((...x) => this(...x).add(other));
});

/**
 * Not operation for a function
 * @returns Returns a FunctionObject representing the not operation for the function
 */
lodash.set(operationHandlers, 'arrayfunctionobject.not', function () {
  return arrayObject((...x) => this(...x).not());
});

/**
 * Function to negate a function
 * @returns Returns a FunctionObject representing the negation of the function
 */
lodash.set(operationHandlers, 'arrayfunctionobject.neg', function() {
  return arrayObject((...x) => {
    let r = this(...x);
    return r?.neg() || -r;
  });
});

lodash.set(operationHandlers, 'arrayfunctionobject.equals.arrayfunctionobject', function (other) {
  return this === other;
});

lodash.set(operationHandlers, 'arrayfunctionobject.notEquals.arrayfunctionobject', function () {
  return true;
});