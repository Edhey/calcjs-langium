const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f;
$f = functionObject(function($x) {
return functionObject(function($y) {
return functionObject(function($z) {
return $x.add($y).add($z);
});
});
});
$f.assign([Complex('1')], functionObject(function($y) {
return $y.mul($y);
}));
print($f(Complex('1'))(Complex('3')));
print($f(Complex('2'))(Complex('3'))(Complex('5')));
print($f(Complex('1'))); 