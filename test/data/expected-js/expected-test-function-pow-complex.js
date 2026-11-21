const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f, $a;
$f = functionObject(function($x) {
return $x.add(Complex('1'));
});
$a = Complex('2').add(Complex('3i'));
print($f.pow($a)(Complex('2'))); 