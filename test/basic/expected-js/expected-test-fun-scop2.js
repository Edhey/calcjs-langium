const { Complex,functionObject,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $x, $f, $b;
$x = Complex('10');
$f = functionObject(function($a) {
let $x;
$x = $a.add(Complex('2i'));
return Complex('3i').mul($x);
});
$b = $f(Complex('4'));
print($b);
print($x); 