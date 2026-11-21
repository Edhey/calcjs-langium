const { Complex,write } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $a, $b;
for ($a = Complex('0'); $a.lessThan(Complex('5')); $a = $a.add(Complex('1'))) {
write('a = ', $a);
for ($b = Complex('0'); $b.lessThan($a); $b = $b.add(Complex('1'))) {
write('  b = ', $b)
}
}; 