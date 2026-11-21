const { functionObject,Complex,write,arrayObject } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $Person, $Teacher, $john;
$Person = functionObject(function($name, $age) {
let $this;
$this = functionObject(function() {
return Complex('0');
});
$this.assign(['name'], $name);
$this.assign(['greet'], functionObject(function($other) {
return write('I am '.add($this('name')).add('. Glad to meet you ').add($other));
}));
$this.assign(['age'], $age);
return $this;
});
$Teacher = functionObject(function($name, $age, $subjects) {
let $this;
$this = $Person($name, $age);
$this.assign(['subjects'], $subjects);
return $this;
});
$john = $Teacher('John', Complex('69'), arrayObject('PL', 'DMSI'));
$john('greet')('Juana');
write($john('name'), 'teaches subject', $john('subjects')(Complex('0'))); 