const { functionObject,Complex,print } = await import("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f;
$f = functionObject(function($x) {
return $x.add(Complex('1'));
});
print(true.add($f)(Complex('2')));
print(false.add($f)(Complex('2')));
print(!Complex('0').add($f)(Complex('4'))); 
