const { Complex,arrayObject,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $a, $b, $c;
$a = arrayObject(Complex('1'), Complex('2'), Complex('3'));
$b = arrayObject(Complex('3'), Complex('2'), Complex('1'));
$c = arrayObject(Complex('2'), Complex('3'), Complex('5'), Complex('6'));
print($a.sub($b));
print($b.sub($a));
print($a.sub($c)); 