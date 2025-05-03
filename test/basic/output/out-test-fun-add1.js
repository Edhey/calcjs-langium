const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");

/* end of preamble of generated code */

let $f, $h;

($f = functionObject(function($x) {
  return Complex('2').mul($x);
}), $h = $f.add(Complex('3'))), print($h(Complex('1').add(Complex('i')))); 