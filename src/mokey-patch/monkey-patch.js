/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores del lenguage
 * Práctica 6 - While and for loops
 *
 * @author Himar Edhey Hernandez Alonso
 * @since Wed 19 Mar 2025 
 * @desc Patches the objects to add new operations
 * @see https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392
 */

require('./handlers/boolean-monkey-patch.js');
const { Complex } = require('./handlers/complex-monkey-patch.js');
require('./handlers/function-monkey-patch.js');
require('./handlers/string-monkey-patch.js');
require('./handlers/function-object-monkey-patch.js');
require('./handlers/array-function-object-monkey-patch.js');

const { allOperators, implementedTypes, operationHandlers } = require('./monkey-patch-handlers.js');

for (const type of implementedTypes) {
  for (const operator in allOperators) {
    type.prototype[operator] = function (other) {
      const thisValue = this;
      if (this === null) {
        thisValue = Complex(0);
      }
      if (other === null) {
        other = Complex(0);
      }
      const firstType = (typeof thisValue === 'object' && thisValue instanceof Complex) ?
        'complex' : thisValue.constructor.name.toLowerCase();
      if (other === undefined) {
        const unaryOperation = operationHandlers[firstType][operator];
        if (unaryOperation) {
          return unaryOperation.call(thisValue);
        }
        return operationHandlers.default(firstType, operator, 'undefined');
      }
      const secondType = (typeof other === 'object' && other instanceof Complex) ?
        'complex' : other.constructor.name.toLowerCase();

      const operation = operationHandlers[firstType][operator][secondType];
      if (operation) {
        return operation.call(thisValue, other);
      }
      return operationHandlers.default(firstType, operator, secondType);
    }
  }
}