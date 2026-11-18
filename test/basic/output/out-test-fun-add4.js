const { functionObject,print,Complex } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");

/* end of preamble of generated code */

let $f;

$f = functionObject(function($x) {
  return functionObject(function($y) {
    return $x.add($y);
  });
}), print(Complex('2').add($f)(Complex('3'))(Complex('5'))); 