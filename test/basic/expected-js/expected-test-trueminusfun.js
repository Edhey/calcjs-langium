const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f;
$f = functionObject(function($x) {
return $x.add(Complex('1'));
});
print(true.sub($f)(Complex('2')));
print(false.sub($f)(Complex('2')));
print(Complex('0').not().sub($f)(Complex('4'))); 