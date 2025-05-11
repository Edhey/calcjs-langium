const { Complex,print } = await import("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");


/* end of preamble of generated code */

let $x, $y, $z, $a, $b, $c, $d;
$x = Complex('3.3');
$y = Complex('2.2');
$z = $x.sub($y);
$a = Complex('1.1');
$b = Complex('4.4');
$c = $a.add($b);
$d = $z.sub($c);
print($d); 
