const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $fact;

$fact = functionObject(function($n) {
  return $n.equals(Complex('0')).not() && $n.mul($fact($n.sub(Complex('1')))) || Complex('1');
}), print($fact(Complex('5'))); 