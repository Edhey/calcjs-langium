const { functionObject,Complex,write } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $f, $g, $h;

((((((($f = functionObject(function($x) {
  return functionObject(function($y) {
    return $x.add($y);
  });
}), $g = functionObject(function($y) {
  return $y.mul($y);
})), $f.assign([$g], functionObject(function($v) {
  return $f($g($v))(Complex('3'));
}))), $h = functionObject(function($x) {
  return $x.mul($x);
})), write($h.equals($f))), write($f(Complex('2'))(Complex('3')))), write($f($g)(Complex('4')))), write($f($h)(Complex('4')))), write($f($h)(Complex('4'))(Complex('5'))); 