const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $isPositive, $isNotPositive;

((($isPositive = functionObject(function($n) {
  return Complex('0').lessThan($n);
}), $isNotPositive = functionObject(function($n) {
  return $isPositive($n).not();
})), print($isNotPositive(Complex('5').neg()))), print($isNotPositive(Complex('5')))), print($isNotPositive(Complex('0'))); 