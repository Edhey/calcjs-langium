const { functionObject,print,Complex } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $a, $b;
$a = functionObject(function() {
print(Complex('2'));
return functionObject(function() {
return print(Complex('3'));
});
});
$b = functionObject(function() {
return print(Complex('3'));
});
$a()();
$b(); 