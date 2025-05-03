const { functionObject,Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $sum, $r;

($sum = functionObject(function($n) {
  return functionObject(function($x) {
    return $n.add($x);
  });
}), $r = $sum(Complex('4'))(Complex('5'))), print($r); 