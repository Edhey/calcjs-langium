const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $sum, $r;
$sum = functionObject(function($n) {
return functionObject(function($x) {
return $n.add($x);
});
});
$r = $sum(Complex('4'))(Complex('5'));
print($r); 