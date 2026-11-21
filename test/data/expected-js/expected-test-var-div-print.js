const { Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $x, $y, $z, $w, $v;
$x = Complex('10');
$y = Complex('2');
$z = $x.div($y);
print($z);
$w = $z.div(Complex('2'));
print($w);
$v = $w.div(Complex('1'));
print($v); 