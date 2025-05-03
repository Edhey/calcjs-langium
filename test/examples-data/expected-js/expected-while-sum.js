import { Complex,print } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $sum, $a;

($sum = $a = Complex('0'), (() => {
  let result = false;

  while ($a.lessThan(Complex('10'))) {
    result = ($sum = $sum.add($a.mul($a)), $a = $a.add(Complex('1')));
  }

  return result;
})()), print($sum); 