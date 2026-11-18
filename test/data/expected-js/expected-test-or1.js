import { functionObject,Complex,print } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $isNegative, $isGreaterThanTen;

((($isNegative = functionObject(function($n) {
  return $n.lessThan(Complex('0'));
}), $isGreaterThanTen = functionObject(function($n) {
  return Complex('10').lessThan($n);
})), print($isNegative(Complex('5').neg()) || $isGreaterThanTen(Complex('5').neg()))), print($isNegative(Complex('5')) || $isGreaterThanTen(Complex('5')))), print($isNegative(Complex('15')) || $isGreaterThanTen(Complex('15'))); 