const { functionObject,print,Complex } = require("/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $f;

((($f = functionObject(function($x) {
  return functionObject(function($y) {
    return $x.add($y);
  });
}), print(Complex('2').sub($f)(Complex('3'))(Complex('5')))), print($f.sub(Complex('2'))(Complex('3'))(Complex('5')))), print($f.sub(true)(Complex('3'))(Complex('5')))), print(true.sub($f)(Complex('3'))(Complex('5'))); 