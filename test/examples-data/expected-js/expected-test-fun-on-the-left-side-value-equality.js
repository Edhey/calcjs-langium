const { functionObject,Complex,write } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f;
$f = functionObject(function($x) {
return functionObject(function($y) {
return $x.add($y);
});
});
$f.assign([Complex('2'), Complex('3')], Complex('8'));
write($f(Complex('2'))(Complex('3')));
write($f(Complex('1').add(Complex('1')))(Complex('3')));
write($f(Complex('2'))(Complex('5')));
$f.assign([Complex('2').add(Complex('i'))], Complex('10'));
write($f(Complex('2').add(Complex('i'))));
$f.assign([Complex('2').add(Complex('i')), Complex('3')], 'hola');
write($f(Complex('2').add(Complex('i')))(Complex('3'))); 