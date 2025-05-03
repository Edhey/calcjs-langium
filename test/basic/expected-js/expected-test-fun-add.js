let $f, $g, $h, $k; 
(((($f = functionObject(function ($x) { 
  return Complex('2').mul($x); }),
    $g = functionObject(function ($x) { returnComplex('3').mul($x); })),
    $h = $g.add($f)),
    $k = $g.mul($f)),
print($h(Complex('1').add(Complex('i'))))), print($k(Complex('2').sub(Complex('i'))));