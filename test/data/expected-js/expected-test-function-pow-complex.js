import { functionObject,Complex,print } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $f, $a;

($f = functionObject(function($x) {
  return $x.add(Complex('1'));
}), $a = Complex('2').add(Complex('3i'))), print($f.pow($a)(Complex('2'))); 