const { functionObject,print,Complex } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $tripleLessThan;
$tripleLessThan = functionObject(function($a) {
return functionObject(function($b) {
return functionObject(function($c) {
return $a.lessThan($b) && $b.lessThan($c);
});
});
});
print($tripleLessThan(Complex('1'))(Complex('2'))(Complex('3')));
print($tripleLessThan(Complex('1'))(Complex('3'))(Complex('2')));
print($tripleLessThan(Complex('2'))(Complex('1'))(Complex('3'))); 