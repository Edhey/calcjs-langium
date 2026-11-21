const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f, $g, $h, $k;
$f = functionObject(function($x) {
return Complex('2').mul($x);
});
$g = functionObject(function($x) {
return Complex('3').mul($x);
});
$h = $g.add($f);
$k = $g.mul($f);
print($h(Complex('1').add(Complex('i'))));
print($k(Complex('2').sub(Complex('i')))); 