const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f, $h;
$f = functionObject(function($x) {
return Complex('2').mul($x);
});
$h = $f.add(Complex('3'));
print($h(Complex('1').add(Complex('i')))); 