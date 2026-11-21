const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $sub, $isPositive, $c;
$sub = functionObject(function($a) {
return functionObject(function($b) {
return $a.sub($b);
});
});
$isPositive = functionObject(function($n) {
return Complex('0').lessThan($n);
});
$c = $sub(Complex('3'))(Complex('5'));
print($isPositive($c));
print($isPositive($sub(Complex('5'))(Complex('3'))));
print($isPositive($c.add(Complex('1')))); 