const { Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $sum, $a;
$sum = $a = Complex('0');
while ($a.lessThan(Complex('10'))) {
$sum = $sum.add($a.mul($a));
$a = $a.add(Complex('1'))
};
print($sum); 