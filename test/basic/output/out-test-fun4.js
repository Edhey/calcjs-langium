const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $add, $square, $double;

(($add = functionObject(function($f) {
  return functionObject(function($g) {
    return functionObject(function($x) {
      return $f($x).add($g($x));
    });
  });
}), $square = functionObject(function($x) {
  return $x.mul($x);
})), $double = functionObject(function($x) {
  return Complex('2').mul($x);
})), print($add($square)($double)(Complex('4'))); 