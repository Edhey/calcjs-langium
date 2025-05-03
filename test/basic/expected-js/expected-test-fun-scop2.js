const { Complex,functionObject,print } = require("/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $x, $f, $b;

((($x = Complex('10'), $f = functionObject(function($a) {
  let $x;
  return $x = $a.add(Complex('2i')), Complex('3i').mul($x);
})), $b = $f(Complex('4'))), print($b)), print($x); 