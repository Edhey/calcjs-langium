import { functionObject,print,Complex } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $isEqual;

(($isEqual = functionObject(function($a) {
  return functionObject(function($b) {
    return $a.equals($b);
  });
}), print($isEqual(Complex('4'))(Complex('4')))), print($isEqual(Complex('4'))(Complex('5')))), print($isEqual(Complex('4'))(Complex('1').neg())); 