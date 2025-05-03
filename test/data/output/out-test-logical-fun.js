const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $isPositive, $isLessThanTen, $isGreaterThanFive;

(((($isPositive = functionObject(function($n) {
  return Complex('0').lessThan($n);
}), $isLessThanTen = functionObject(function($n) {
  return $n.lessThan(Complex('10'));
})), $isGreaterThanFive = functionObject(function($n) {
  return Complex('5').lessThan($n);
})), print(
  $isPositive(Complex('7')) && $isLessThanTen(Complex('7')) || $isGreaterThanFive(Complex('7'))
)), print(
  $isPositive(Complex('7').neg()) && $isLessThanTen(Complex('7').neg()) || $isGreaterThanFive(Complex('7').neg())
)), print(
  $isPositive(Complex('15')) && $isLessThanTen(Complex('15')) || $isGreaterThanFive(Complex('15'))
); 