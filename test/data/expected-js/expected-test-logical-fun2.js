const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $isZero, $isPositive, $isNegative;
$isZero = functionObject(function($n) {
return $n.equals(Complex('0'));
});
$isPositive = functionObject(function($n) {
return Complex('0').lessThan($n);
});
$isNegative = functionObject(function($n) {
return $n.lessThan(Complex('0'));
});
print($isZero(Complex('4')) && $isPositive(Complex('4')) || $isNegative(Complex('4')));
print($isZero(Complex('0')) && $isPositive(Complex('3')) || $isNegative(Complex('3')));
print($isZero(Complex('2').neg()) && $isPositive(Complex('2').neg()) || $isNegative(Complex('2').neg())); 