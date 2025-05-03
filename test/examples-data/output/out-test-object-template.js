const { functionObject,Complex,write } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/code-generation/support-lib.js");

/* end of preamble of generated code */

let $Person, $john;

($Person = functionObject(function($name) {
  let $this;

  return (($this = functionObject(function() {
    return Complex('0');
  }), $this.assign(['name'], $name)), $this.assign(['greet'], functionObject(function($other) {
    return write('I am '.add($this('name')).add('. Glad to meet you ').add($other));
  }))), functionObject(function($age) {
    return $this.assign(['age'], $age), $this;
  });
}), $john = $Person('John')(Complex('25'))), $john('greet')('Juana'); 