const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $isPositive, $isLessThanTen;
$isPositive = functionObject(function($n) {
return Complex('0').lessThan($n);
});
$isLessThanTen = functionObject(function($n) {
return $n.lessThan(Complex('10'));
});
print($isPositive(Complex('5')) && $isLessThanTen(Complex('5')) || Complex('2'));
print($isPositive(Complex('5').neg()) && $isLessThanTen(Complex('5').neg()) || Complex('1'));
print($isPositive(Complex('15')) && $isLessThanTen(Complex('15')) || Complex('1')); 