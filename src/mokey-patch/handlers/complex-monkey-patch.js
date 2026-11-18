/**
  * Universidad de La Laguna
  * Escuela Superior de Ingeniería y Tecnología
  * Grado en Ingeniería Informática
  * Procesadores del lenguage
  * TFA - Langium Syntaxis and Errors for Calculator
  *
  * @author Himar Edhey Hernández Alonso
  * @since Wed 19 Mar 2025 
  * @desc Handler for complex operations
  */

let oldComplex = {};
import Complex from 'complex.js';
import { operationHandlers, implementedTypes, allOperators } from '../monkey-patch-handlers.js';
import lodash from 'lodash';
import { functionObject } from '../../function-object/function-object.js';

// Initialize the complex operators in the operationHandlers
for(const operator in allOperators) {
  lodash.set(operationHandlers, `complex.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(Complex);

const Operators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', equals: '==', notEquals: '!=',
}

for (const op in Operators) {
  oldComplex[op] = Complex.prototype[op];
  /**
   * Operates a complex with a complex
   * @param {Complex} other complex to operate with
   * @returns result of the operation
   */
  lodash.set(operationHandlers, `complex.${op}.complex`, function (other) {
    return oldComplex[op].call(this, other);
  });
  /**
   * Operates a complex with a boolean
   * @param {boolean} other boolean to operate with
   * @returns result of the operation
   */
  lodash.set(operationHandlers, `complex.${op}.boolean`, function (other) {
    return oldComplex[op].call(this, Complex(Number(other)));
  });
  /**
   * Operates a complex with a function
   * @param {function} other function to operate with
   * @returns result of the operation
   */
  lodash.set(operationHandlers, `complex.${op}.functionobject`, function (other) {
    try {
      if (op === 'equals' || op === 'notEquals') {
        return this[op](other(this));
      }
      return functionObject((...args) => this[op](other(...args)));
    } catch (error) {
      throw new Error(
        `Error: Unsupported ${op} for type ${typeof other}` +
        ` with ${error.message}`
      );
    }
  });
}

/**
 * Adds a string to a complex
 * @param {string} other string to add to the complex
 * @returns concatenated complex and string
 */
lodash.set(operationHandlers, 'complex.add.string', function (other) {
  return this.toString() + other;
});

/**
 * Multiplies a complex to a string
 * @param {Complex} other complex to mul to the string
 * @returns concatenated string and complex
 */
lodash.set(operationHandlers, 'complex.mul.string', function (other) {
  if (this.im !== 0) {
    throw new Error('Error: Unsupported * for string and complex with ' + 
      'imaginary part');
  }
  return other.repeat(this.re);
});

/**
 * Not operator for a complex
 * @returns false if the complex is not zero,
 * true otherwise
 */
lodash.set(operationHandlers, 'complex.not', function () {
  return oldComplex['equals'].call(this, Complex(0));
});

/**
 * Check if a complex is less than another
 * @param {Complex} other complex to compare with
 * @returns true if the complex is less than the other,
 * false otherwise
 */
lodash.set(operationHandlers, 'complex.lessThan.complex', function (other) {
  if (this.re < other.re) return true;
  if (this.re == other.re && this.im < other.im) return true;
  return false;
});

/**
 * Check if a complex is greater than another
 * @param {Complex} other complex to compare with
 * @returns true if the complex is greater than the other,
 * false otherwise
 */
lodash.set(operationHandlers, 'complex.greaterThan.complex', function (other) {
  return !this.lessOrEqualThan(other);
});

/**
 * Check if a complex is not equal to another
 * @param {Complex} other complex to compare with
 * @returns true if the complex is not equal to the other,
 * false otherwise
 */
lodash.set(operationHandlers, 'complex.notEquals.complex', function (other) {
  return !this.equals(other);
});

/**
 * Check if a complex is less or equal than a number
 * @param {number} other number to compare with
 * @returns true if the complex is less or equal than the number,
 * false otherwise
 */
lodash.set(operationHandlers, 'complex.lessEqualThan.complex', function (other) {
  return this.lessThan(other) || this.equals(other);
});

/**
 * Check if a complex is greater or equal than another
 * @param {Complex} other complex to compare with
 * @returns true if the complex is greater or equal than the other,
 * false otherwise
 */
lodash.set(operationHandlers, 'complex.greaterEqualThan.complex', function (other) {
  return !this.lessThan(other);
});


/**
 * Complex negation
 * @returns negated complex
*/
oldComplex['neg'] = Complex.prototype['neg'];
lodash.set(operationHandlers, 'complex.neg', function () {
  return oldComplex['neg'].call(this);
});

export {
  Complex
};