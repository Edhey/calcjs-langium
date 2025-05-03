/**
  * Universidad de La Laguna
  * Escuela Superior de Ingeniería y Tecnología
  * Grado en Ingeniería Informática
  * Procesadores del lenguage
  * Práctica 6 - While and for loops
  *
  * @author Himar Edhey Hernández Alonso
  * @since Wed 19 Mar 2025 
  * @desc Handler for string operations
  */

const { operationHandlers, implementedTypes, allOperators } = require('../monkey-patch-handlers.js');
const Complex = require('complex.js');
const lodash = require('lodash');
const { functionObject } = require('../../function-object/function-object.js');

// Initialize the string operators in the operationHandlers
for(const operator in allOperators) {
  lodash.set(operationHandlers, `string.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(String);

/**
 * Not operator for a string
 * @returns false if the string is not empty, 
 * true otherwise
 */
lodash.set(operationHandlers, 'string.not', function () {
  return this === '';
});

const comparisonOperators = {
  equals: '==',
  notEquals: '!=',
  lessThan: '<',
  greaterThan: '>',
  lessThanOrEqual: '<=',
  greaterThanOrEqual: '>=',
};

/**
 * Handler for comparison operators
 */
for (const operator in comparisonOperators) {
  lodash.set(operationHandlers, `string.${operator}.string`, function (other) {
    return eval(`this ${comparisonOperators[operator]} other`);
  });
}

/**
 * Not operator for a string
 * @returns false if the string is not empty,
 * true otherwise
 */
lodash.set(operationHandlers, 'string.not', function () {
  return this == '';
});

/**
 * Adds a string to a string
 * @param {string} other string to add to the string
 * @returns added string
 */
lodash.set(operationHandlers, 'string.add.string', function (other) {
  return this + other;
});

/**
 * Adds a string to a function
 * @param {function} other function to add to the string
 * @returns added function
 */
lodash.set(operationHandlers, 'string.add.functionobject', function (other) {
  try {
    return functionObject((...args) => this.add((other(...args))));
  } catch (error) {
    throw new Error(
      `Error: Unsupported add for type ${typeof other}` +
      ` with ${error.message}`
    );
  }
});

/**
 * Adds a string to a boolean
 * @param {boolean} other boolean to add to the string
 * @returns added boolean
 */
lodash.set(operationHandlers, 'string.add.boolean', function (other) {
  return this + other.toString();
});

/**
 * Multiplicates a string by a Complex with only real part
 * @param {Complex} other number to multiply the string by
 * @returns multiplied string
 */
lodash.set(operationHandlers, 'string.add.complex', function (other) {
  return this + other.toString();
});

/**
 * Multiplicates a string by a Complex with only real part
 * @param {Complex} other number to multiply the string by
 * @returns multiplied string
 */
lodash.set(operationHandlers, 'string.mul.complex', function (other) {
  if (other.im !== 0) {
    throw new Error(`Error: Unsupported ${operator} for type ${typeof other}` +
      ' with imaginary part');
  }
  return this.repeat(other.re);
});

lodash.set(operationHandlers, 'string.equals.complex', function (other) {
  return false
});

for (const op in Operators) {
  String.prototype[op] = function (other) {
    if (other) {
      return lodash.get(operationHandlers, `string.${op}.${typeof other}`)(other);
    }
    return lodash.get(operationHandlers, `string.${op}`)(other);
  };
}
