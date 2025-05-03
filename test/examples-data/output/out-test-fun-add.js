const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $f, $g;

($f = functionObject(function($x) {
  return $x.add(Complex('1'));
}), $g = functionObject(function($x) {
  return $x.add(Complex('2'));
})), print($f.add($g)(Complex('1'))); 