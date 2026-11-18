import { functionObject,Complex,write } from '/home/usuario/practicas/02-Translating-Arithmetic-Expressions-to-JavaScript/arith2js-himar_edhey-hernandez-alu0101552392/src/support-lib.js';

/* end of preamble of generated code */

let $Person, $john;

($Person = functionObject(function($name) {
  return functionObject(function($age) {
    let $this;

    return ((($this = functionObject(function() {
      return Complex('0');
    }), $this.assign(['name'], $name)), $this.assign(['greet'], functionObject(function($other) {
      return write('I am '.add($this('name')).add('. Glad to meet you ').add($other));
    }))), $this.assign(['age'], $age)), $this;
  });
}), $john = $Person('John')(Complex('25'))), $john('greet')('Juana'); 