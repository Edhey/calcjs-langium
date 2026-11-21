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

import { Complex, type Complex as ComplexInstance } from 'complex.js';
import lodash from 'lodash';
import { allOperators, implementedTypes, operationHandlers } from '../monkey-patch-handlers.js';
import { functionObject } from '../../function-object/function-object.js';

type ComplexMethod = (this: ComplexInstance, ...args: unknown[]) => unknown;

const oldComplex: Record<string, ComplexMethod> = {};
const complexPrototype = Complex.prototype as unknown as Record<string, ComplexMethod>;

for (const operator in allOperators) {
  lodash.set(operationHandlers, `complex.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(Complex);

const Operators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', equals: '==', notEquals: '!='
};

for (const op in Operators) {
  oldComplex[op] = complexPrototype[op];
  lodash.set(operationHandlers, `complex.${op}.complex`, function (this: ComplexInstance, other: ComplexInstance) {
    return oldComplex[op].call(this, other);
  });
  lodash.set(operationHandlers, `complex.${op}.boolean`, function (this: ComplexInstance, other: boolean) {
    return oldComplex[op].call(this, Complex(Number(other)));
  });
  lodash.set(operationHandlers, `complex.${op}.functionobject`, function (this: ComplexInstance, other: (...args: unknown[]) => unknown) {
    try {
      if (op === 'equals' || op === 'notEquals') {
        return (this as ComplexInstance & Record<string, (value: unknown) => unknown>)[op](other(this) as never);
      }
      return functionObject((...args: unknown[]) => {
        const result = (this as ComplexInstance & Record<string, (value: unknown) => unknown>)[op](other(...args));
        return result;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error: Unsupported ${op} for type ${typeof other} with ${message}`);
    }
  });
}

lodash.set(operationHandlers, 'complex.add.string', function (this: ComplexInstance, other: string) {
  return this.toString() + other;
});

lodash.set(operationHandlers, 'complex.mul.string', function (this: ComplexInstance, other: string) {
  if (this.im !== 0) {
    throw new Error('Error: Unsupported * for string and complex with imaginary part');
  }
  return other.repeat(this.re);
});

lodash.set(operationHandlers, 'complex.not', function (this: ComplexInstance) {
  return oldComplex.equals.call(this, Complex(0));
});

lodash.set(operationHandlers, 'complex.lessThan.complex', function (this: ComplexInstance & { lessThan?: (other: ComplexInstance) => boolean }, other: ComplexInstance) {
  if (this.re < other.re) return true;
  if (this.re === other.re && this.im < other.im) return true;
  return false;
});

lodash.set(operationHandlers, 'complex.greaterThan.complex', function (this: ComplexInstance & { lessOrEqualThan: (other: ComplexInstance) => boolean }, other: ComplexInstance) {
  return !this.lessOrEqualThan(other);
});

lodash.set(operationHandlers, 'complex.notEquals.complex', function (this: ComplexInstance, other: ComplexInstance) {
  return !this.equals(other);
});

lodash.set(operationHandlers, 'complex.lessEqualThan.complex', function (this: ComplexInstance & { lessThan: (other: ComplexInstance) => boolean }, other: ComplexInstance) {
  return this.lessThan(other) || this.equals(other);
});

lodash.set(operationHandlers, 'complex.greaterEqualThan.complex', function (this: ComplexInstance & { lessThan: (other: ComplexInstance) => boolean }, other: ComplexInstance) {
  return !this.lessThan(other);
});

oldComplex.neg = complexPrototype.neg;
lodash.set(operationHandlers, 'complex.neg', function (this: ComplexInstance) {
  return oldComplex.neg.call(this);
});

export { Complex };
export default Complex;
