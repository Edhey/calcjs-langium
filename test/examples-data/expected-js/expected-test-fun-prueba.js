import { functionObject,write,Complex } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $f, $h;

((($f = functionObject(function($x) {
  return functionObject(function($y) {
    return $x.add($y);
  });
}), $h = functionObject(function($x) {
  return $x.mul($x);
})), write($h.equals($f))), write($f.add(Complex('4'))(Complex('4'))(Complex('5')))), write($f($h)(Complex('4'))); 