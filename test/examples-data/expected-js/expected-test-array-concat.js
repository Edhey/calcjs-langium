const { Complex,arrayObject,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $a, $b;
$a = arrayObject(Complex('4').add(Complex('2')), Complex('5').add(Complex('3i')), Complex('9').sub(Complex('i')));
print('a = ', $a);
$b = $a('concat')(arrayObject(Complex('12'), Complex('13')))();
print('b is of length: ', $b('length'));
print('b = ', $b); 