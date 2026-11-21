const { Complex,print } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $a, $b, $c, $d, $e, $f;
$a = Complex('2').neg();
$b = Complex('3');
$c = Complex('4');
$d = Complex('1');
$e = $b.mul($c.sub($d));
$f = $a.add($e);
print($f); 