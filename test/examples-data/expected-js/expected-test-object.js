const { functionObject,Complex,write } = await import("/home/edhey/3oIngInformatica/PL/tfa-himar_edhey-hernandez-alu0101552392/out/code-generation/support-lib.js");


/* end of preamble of generated code */

let $obj;
$obj = functionObject(function($x) {
return $x;
});
$obj.assign(['name'], 'John');
$obj.assign(['age'], Complex('42'));
$obj.assign(['greet'], functionObject(function($other) {
return write('I am '.add($obj('name')).add('. I am ').add($obj('age')).add(' years old. Glad to meet you ').add($other));
}));
$obj('greet')('Juana'); 