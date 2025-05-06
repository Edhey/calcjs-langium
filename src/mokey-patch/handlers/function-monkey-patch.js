/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 19 Mar 2025 
 * @desc Handler for Function operations
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himarlodashedhey-hernandez-alu0101552392}
 *
 */

import { Complex } from 'complex.js';
import { operationHandlers, implementedTypes, allOperators } from '../monkey-patch-handlers.js';
import lodash from 'lodash';

// Initialize the function operators in the operationHandlers
for(const operator in allOperators) {
  lodash.set(operationHandlers, `function.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(Function);

/**
 * Represents the operators that can be used in the function
 * @type {{add: string, mul: string, div: string, equals: string, pow: string, neg: string}}
 */
const Operators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', equals: '==', notEquals: '!=',
};

for (let operator in Operators) {
  /**
   * Operates a function with a boolean. Coertion of the boolean to a complex
   * @param {Boolean} other It is the boolean to operate
   * @returns Returns a function that operates the function with the boolean as a complex
   */
  lodash.set(operationHandlers, `function.${operator}.boolean`, function (other) {
    return (...x) => this(...x)[operator](Complex(Number(other)));
  });

  /**
   * Operates the function with the function result
   * @param {Function} other It is the function to operate
   * @returns Returns a function that operates the function with the function result
   */
  lodash.set(operationHandlers, `function.${operator}.function`, function (other) {
    try {
      return (...x) => this(...x)[operator](other(...x));
    } catch (e) {
      throw new Error(`Unsupported ${operator} for function ${other}`);
    }
  });

  /**
   * Operates a function with an object. The object must be a Complex.
   * @param {Object} other It is the object to operate must be a Complex
   * @returns Returns a function that operates the function with the object as a
   * complex
   * @throws Error if the object is not a Complex
   */
  lodash.set(operationHandlers, `function.${operator}.complex`, function (other) {
    return (...x) => this(...x)[operator](other);
  });
}

/**
 * Function to concatenate a function with a string
 * @param {String} other It is the string to concatenate
 * @returns Returns the concatenation of the function with the string
 */
lodash.set(operationHandlers, 'function.add.string', function (other) {
  return (...x) => this(...x).add(other);
});

/**
 * Not operation for a function
 * @returns Returns the not operation for the function
 */
lodash.set(operationHandlers, 'function.not', function () {
  return (...x) => this(...x).not();
});

/**
 * Function to negate a function
 * @returns Returns the negation of the function
 */
lodash.set(operationHandlers, 'function.neg', function() {
  return (...x) => {
    let r = this(...x);
    return r?.neg() || -r;
  };
});