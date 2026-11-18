const { Complex,print } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");

/* end of preamble of generated code */

let $a;

$a = Complex('10'), (() => {
  let result = false;

  while (Complex('0').lessThan($a)) {
    result = ($a = $a.sub(Complex('1')), print($a));
  }

  return result;
})(); 