const { functionObject,Complex,write } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");

/* end of preamble of generated code */

let $f, $g;

((($f = functionObject(function($x) {
  return functionObject(function($y) {
    return $x.add($y);
  });
}), $g = functionObject(function($y) {
  return $y.mul($y);
})), $f.assign([$g], functionObject(function($v) {
  return $f($g($v))(Complex('3'));
}))), write($f(Complex('2'))(Complex('3')))), write($f($g)(Complex('4'))); 