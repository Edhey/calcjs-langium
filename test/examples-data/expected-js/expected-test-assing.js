import { functionObject,Complex,print } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $f, $g;

((((($f = functionObject(function($x) {
  return $x.add(Complex('1'));
}), $f.assign([Complex('0')], Complex('8'))), print($f(Complex('0')))), $g = functionObject(function($x) {
  return functionObject(function($y) {
    return $x.add($y);
  });
})), $g.assign([Complex('1'), Complex('0')], Complex('9'))), print($g(Complex('1'))(Complex('0')))), print($g(Complex('1'))(Complex('2'))); 