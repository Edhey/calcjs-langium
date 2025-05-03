const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");

/* end of preamble of generated code */

let $f, $a;

($f = functionObject(function($x) {
  return $x.add(Complex('1'));
}), $a = Complex('1').add(Complex('2i'))), print($a.notEquals($f(Complex('1')))); 