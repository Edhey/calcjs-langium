/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Procesadores de Lenguajes
 * Práctica 6 - While, for
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 19 Mar 2025 
 * @desc Handler for boolean operations
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himarlodashedhey-hernandez-alu0101552392}
 *
 */

const { Complex } = require('complex.js');
const { functionObject } = require('../../function-object/function-object.js');
const { operationHandlers, implementedTypes, allOperators } = require('../monkey-patch-handlers.js');
const lodash = require('lodash');

// Initialize the boolean operators in the operationHandlers
for(const operator in allOperators) {
  lodash.set(operationHandlers, `boolean.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(Boolean);

BasicBooleanOperators = {
  add: '+', sub: '-', equals: '==', notEquals: '!='
};

for (let op in BasicBooleanOperators) {
  /**
   * Coertion of a boolean to a complex to operate with other as a complex
   * @param {Boolean} other It is the boolean to operate
   * @returns Returns the operation of the boolean with the boolean as a complex
   */
  lodash.set(operationHandlers, `boolean.${op}.boolean`, function (other) {
    return Complex(Number(this))[op](Complex(Number(other)));
  });

  /**
   * Coertion of a boolean to a function to operate with other as a function
   * @param {Function} other It is the function to operate
   * @returns Returns the operation of the boolean with the function
   */
  lodash.set(operationHandlers, `boolean.${op}.functionobject`, function (other) {
    try {
      return functionObject((...args) => this[op](other(...args)));
    } catch (e) {
      throw new Error(`Unsupported ${op} for function ${other}`);
    }
  });

  /**
   * Coertion of a boolean to a complex to operate with other as a complex
   * @param {Object} other It is the object to operate
   * @returns Returns the operation of the boolean with the object as a complex
   * @throws Error if the object is not a Complex
   */
  lodash.set(operationHandlers, `boolean.${op}.complex`, function (other) {
    return Complex(Number(this))[op](other);
  });
}

/**
 * Function to concatenate a boolean with a string
 * @param {String} other It is the string to concatenate
 * @returns Returns the concatenation of the boolean with the string as a string
 */
lodash.set(operationHandlers, 'boolean.add.string', function (other) {
  return this.toString() + other;
});

/**
 * Function to negate a boolean
 * @returns Returns the negation of the boolean
 */
lodash.set(operationHandlers, 'boolean.not', function () {
  return this == false;
});