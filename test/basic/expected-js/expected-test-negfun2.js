const { functionObject,print,Complex } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $f, $h;
$f = functionObject(function($x) {
return $x.neg();
});
$h = $f.neg();
print($f.neg()(Complex('4').sub(Complex('2i'))));
print($h(Complex('4i').neg()));
print($f.neg()(Complex('0'))); 