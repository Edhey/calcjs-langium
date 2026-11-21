const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $add, $square, $double;
$add = functionObject(function($f) {
return functionObject(function($g) {
return functionObject(function($x) {
return $f($x).add($g($x));
});
});
});
$square = functionObject(function($x) {
return $x.mul($x);
});
$double = functionObject(function($x) {
return Complex('2').mul($x);
});
print($add($square)($double)(Complex('4'))); 