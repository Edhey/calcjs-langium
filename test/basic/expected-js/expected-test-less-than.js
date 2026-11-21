const { print,Complex } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

print(Complex('3').add(Complex('4i')).lessThan(Complex('5').add(Complex('6i'))));
print(Complex('5').add(Complex('6i')).lessThan(Complex('3').add(Complex('4i'))));
print(Complex('3').add(Complex('4i')).lessThan(Complex('3').add(Complex('4i'))));
print(Complex('3').add(Complex('4i')).lessThan(Complex('3')));
print(Complex('3').lessThan(Complex('3').add(Complex('4i')))); 