import { functionObject,Complex,print } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $f, $g, $h, $a;

(((($f = functionObject(function($x) {
  return Complex('2').mul($x);
}), $g = functionObject(function($x) {
  return Complex('3').mul($x);
})), $h = $g.add($f)), print($h(Complex('1').add(Complex('i'))))), $a = Complex('1').add($h)), print($a(Complex('1'))); 