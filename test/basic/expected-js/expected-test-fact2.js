const { functionObject,Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $fact;
$fact = functionObject(function($n) {
return $n.equals(Complex('0')).not() && $n.mul($fact($n.sub(Complex('1')))) || Complex('1');
});
print($fact(Complex('5'))); 