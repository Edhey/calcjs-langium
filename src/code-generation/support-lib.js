/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc  Librería de soporte con funciones para: 
 *        El factorial para números complejos:
 *          - A gamma function implementation based on Lanczos Approximation
 *          - @see {@link https://en.wikipedia.org/wiki/Lanczos_approximation}
 * @see {@link https://github.com/Edhey/calcjs-langium}
 *
 */

import '../mokey-patch/monkey-patch.js';
import { Complex } from '../mokey-patch/handlers/complex-monkey-patch.js';
import { FunctionObject, functionObject } from '../function-object/function-object.js';
import { ArrayFunctionObject, arrayObject } from '../function-object/array-function-object.js';
import { ObjectFunctionObject, objectFunctionObject } from '../function-object/object-function-object.js';

const P = [Complex(0.99999999999980993),
Complex(676.5203681218851), Complex(-1259.1392167224028), Complex(771.32342877765313),
Complex(-176.61502916214059), Complex(12.507343278686905), Complex(-0.13857109526572012),
Complex(9.9843695780195716e-6), Complex(1.5056327351493116e-7)];

const SQRT2PI = Complex(Math.sqrt(2 * Math.PI)); // sqrt(2 * PI)

/**
 * @desc The Gamma function is a generalization of the factorial function to
 * non-integer numbers. It is often used in probability and statistics, as it 
 * shows up in the normalizing constants of important probability distributions 
 * such as the Chi-square and the Gamma.
*/
function gamma(zz) {
  if (zz.equals(Complex(0))) { return Complex(1); }
  const z = zz.sub(Complex(1));
  let x = P[0];
  let t = z.add(Complex(7.5)); // z + 7.5

  for (let i = 1; i < P.length; i++) {
    x = x.add(P[i].div(z.add(Complex(i)))); // x += P[i] / (z + i);
  }
  let result = SQRT2PI.mul(t.pow(z.add(Complex(0.5)))).mul(t.neg().exp()).mul(x); // sqrt(2 * PI) * t^(z + 0.5) * e^(-t) * x;
  return zz.mul(result);
}

/**
 * Function to print values
 * @param {Array} values Array of values to print
 */
function print(...values) {
  let result = '';
  for (const value of values) {
    result += (value === null ? 'null' : value.toString()) + ' ';
  }
  console.log(result.trim());
}

/**
 * Imites the print function
 * @param {Array} values Array of values to print
 */
function write(...values) {
  print(...values);
}

/**
 * Function that returns the minimus of two complex numbers.
 * First, it compares the real part of the numbers, and if they are equal,
 * it compares the imaginary part.
 * @param {Complex} number1 First complex number to compare
 * @param {Complex} number2 Second complex number to compare
 */
function min(number1, number2) {
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

/**
 * Function that returns the maximus of two complex numbers.
 * First, it compares the real part of the numbers, and if they are equal,
 * it compares the imaginary part.
 * @param {Complex} number1 First complex number to compare
 * @param {Complex} number2 Second complex number to compare
 */
function max(number1, number2) {
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

/**
 * Function that compares two complex numbers and returns true if the first one is less than the second one.
 * First, it compares the real part of the numbers, and if they are equal,
 * it compares the imaginary part.
 * @param {Complex} complex1 First complex number to compare
 * @param {Complex} complex2 Second complex number to compare
 */
function complexLessThan(complex1, complex2) {
  if (complex1.re < complex2.re) return true;
  else if (complex1.re == complex2.re && complex1.im < complex2.im) return true;
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
  objectFunctionObject,
};