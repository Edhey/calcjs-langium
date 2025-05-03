const { functionObject,print,Complex } = require("/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $tripleLessThan;

(($tripleLessThan = functionObject(function($a) {
  return functionObject(function($b) {
    return functionObject(function($c) {
      return $a.lessThan($b) && $b.lessThan($c);
    });
  });
}), print($tripleLessThan(Complex('1'))(Complex('2'))(Complex('3')))), print($tripleLessThan(Complex('1'))(Complex('3'))(Complex('2')))), print($tripleLessThan(Complex('2'))(Complex('1'))(Complex('3'))); 