const { functionObject,print,Complex } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f;
$f = functionObject(function($x) {
return functionObject(function($y) {
return $x.add($y);
});
});
print(Complex('2').add($f)(Complex('3'))(Complex('5')));
print($f.add(Complex('2'))(Complex('3'))(Complex('5')));
print($f.add('prueba')(Complex('3'))(Complex('5')));
print('prueba'.add($f)(Complex('3'))(Complex('5')));
print($f.add(true)(Complex('3'))(Complex('5')));
print(true.add($f)(Complex('3'))(Complex('5'))); 