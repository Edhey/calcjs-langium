const { Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");

/* end of preamble of generated code */

let $a;

$a = Complex('1'), (() => {
  let result = false;

  do {
    result = (print($a), $a = $a.add(Complex('1')));
  } while ($a.lessThan(Complex('10')));

  return result;
})(); 