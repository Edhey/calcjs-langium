const { functionObject,print,Complex } = await import("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f;
$f = functionObject(function($x) {
return functionObject(function($y) {
return $x.add($y);
});
});
print($f(Complex('3'), Complex('5')));
print($f.div($f)(Complex('3'))(Complex('5')));
print(Complex('2').div($f)(Complex('3'))(Complex('5')));
print($f.div(Complex('2'))(Complex('3'))(Complex('5')));
print(Complex('2').div(Complex('2'))); 
