const { functionObject,Complex,write } = require("/home/usuario/practicas/tfa-himar_edhey-hernandez-alu0101552392/src/support-lib.js");

/* end of preamble of generated code */

let $Person, $thom;

(($Person = functionObject(function($name) {
  return functionObject(function($age) {
    let $this;

    return ((($this = functionObject(function($x) {
      return $x;
    }), $this.assign(['name'], $name)), $this.assign(['age'], $age)), $this.assign(['setAge'], functionObject(function($newAge) {
      return $this.assign(['age'], $newAge);
    }))), $this;
  });
}), $thom = $Person('Thom')(Complex('78'))), $thom('setAge')(Complex('80'))), write($thom('name'), 'is', $thom('age')); 