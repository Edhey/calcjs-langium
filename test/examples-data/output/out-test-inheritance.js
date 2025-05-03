const { functionObject,Complex,write,arrayObject } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $Person, $Teacher, $john;

((($Person = functionObject(function($name) {
  return functionObject(function($age) {
    let $this;

    return ((($this = functionObject(function() {
      return Complex('0');
    }), $this.assign(['name'], $name)), $this.assign(['greet'], functionObject(function($other) {
      return write('I am '.add($this('name')).add('. Glad to meet you ').add($other));
    }))), $this.assign(['age'], $age)), $this;
  });
}), $Teacher = functionObject(function($name) {
  return functionObject(function($age) {
    return functionObject(function($subjects) {
      let $this;
      return ($this = $Person($name)($age), $this.assign(['subjects'], $subjects)), $this;
    });
  });
})), $john = $Teacher('John')(Complex('69'))(arrayObject('PL', 'DMSI'))), $john('greet')('Juana')), write($john('name'), 'teaches subject', $john('subjects')(Complex('0'))); 