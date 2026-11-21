const { Complex,arrayObject,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $a, $b, $c;
$a = arrayObject(Complex('2'), Complex('8'), Complex('10'));
$b = arrayObject(Complex('4'), Complex('4'), Complex('5'));
$c = arrayObject(Complex('10'), Complex('5'), Complex('4'), Complex('2'));
print($a.div($b));
print($b.div($a));
print($a.div($c)); 