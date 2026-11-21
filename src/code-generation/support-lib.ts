/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Librería de soporte con funciones para números complejos y objetos función.
 * @see {@link https://github.com/Edhey/calcjs-langium}
 */

import '../mokey-patch/monkey-patch.js';
import { Complex } from '../mokey-patch/handlers/complex-monkey-patch.js';
import { FunctionObject, functionObject } from '../function-object/function-object.js';
import { ArrayFunctionObject, arrayObject } from '../function-object/array-function-object.js';
import { ObjectFunctionObject, objectFunctionObject } from '../function-object/object-function-object.js';
import type { Complex as ComplexInstance } from 'complex.js';

const P: ComplexInstance[] = [
  Complex(0.99999999999980993),
  Complex(676.5203681218851),
  Complex(-1259.1392167224028),
  Complex(771.32342877765313),
  Complex(-176.61502916214059),
  Complex(12.507343278686905),
  Complex(-0.13857109526572012),
  Complex(9.9843695780195716e-6),
  Complex(1.5056327351493116e-7)
];

const SQRT2PI = Complex(Math.sqrt(2 * Math.PI));

function gamma(zz: ComplexInstance): ComplexInstance {
  if (zz.equals(Complex(0))) { return Complex(1); }
  const z = zz.sub(Complex(1));
  let x = P[0];
  const t = z.add(Complex(7.5));

  for (let i = 1; i < P.length; i++) {
    x = x.add(P[i].div(z.add(Complex(i))));
  }
  const result = SQRT2PI.mul(t.pow(z.add(Complex(0.5)))).mul(t.neg().exp()).mul(x);
  return zz.mul(result);
}

function print(...values: unknown[]): void {
  let result = '';
  for (const value of values) {
    result += (value === null ? 'null' : (value as { toString(): string }).toString()) + ' ';
  }
  console.log(result.trim());
}

function write(...values: unknown[]): void {
  print(...values);
}

function min(number1: ComplexInstance, number2: ComplexInstance): ComplexInstance {
  if (number1.re < number2.re) {
    return number1;
  } else if (number1.re > number2.re) {
    return number2;
  } else {
    if (number1.im < number2.im) {
      return number1;
    } else {
      return number2;
    }
  }
}

function max(number1: ComplexInstance, number2: ComplexInstance): ComplexInstance {
  if (number1.re > number2.re) {
    return number1;
  } else if (number1.re < number2.re) {
    return number2;
  } else {
    if (number1.im > number2.im) {
      return number1;
    } else {
      return number2;
    }
  }
}

function complexLessThan(complex1: ComplexInstance, complex2: ComplexInstance): boolean {
  if (complex1.re < complex2.re) return true;
  else if (complex1.re === complex2.re && complex1.im < complex2.im) return true;
  else return false;
}

export {
  gamma,
  Complex,
  print,
  write,
  min,
  max,
  complexLessThan,
  FunctionObject,
  functionObject,
  ArrayFunctionObject,
  arrayObject,
  ObjectFunctionObject,
  objectFunctionObject
};
