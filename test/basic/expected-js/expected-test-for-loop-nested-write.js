import { Complex,write } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $a, $b;

(() => {
  let result = false;

  for ($a = Complex('0'); $a.lessThan(Complex('5')); $a = $a.add(Complex('1'))) {
    write('a = ', $a), (() => {
      let result = false;

      for ($b = Complex('0'); $b.lessThan($a); $b = $b.add(Complex('1'))) {
        write('  b = ', $b);
      }

      return result;
    })();
  }

  return result;
})(); 