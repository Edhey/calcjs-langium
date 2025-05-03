/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores del lenguage
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernandez Alonso
 * @since Wed 19 Mar 2025 
 * @desc Patches the objects to add new operations
 * @see https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392
 */

import './handlers/boolean-monkey-patch.js';
import { Complex } from './handlers/complex-monkey-patch.js';
import './handlers/function-monkey-patch.js';
import './handlers/string-monkey-patch.js';
import './handlers/function-object-monkey-patch.js';
import './handlers/array-function-object-monkey-patch.js';

import { allOperators, implementedTypes, operationHandlers } from './monkey-patch-handlers.js';

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