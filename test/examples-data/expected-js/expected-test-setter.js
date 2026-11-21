const { functionObject,Complex,write } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $Person, $thom;
$Person = functionObject(function($name, $age) {
let $this;
$this = functionObject(function($x) {
return $x;
});
$this.assign(['name'], $name);
$this.assign(['age'], $age);
$this.assign(['setAge'], functionObject(function($newAge) {
return $this.assign(['age'], $newAge);
}));
return $this;
});
$thom = $Person('Thom', Complex('78'));
$thom('setAge')(Complex('80'));
write($thom('name'), 'is', $thom('age')); 