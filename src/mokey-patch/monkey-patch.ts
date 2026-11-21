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
 * @see https://github.com/Edhey/calcjs-langium
 */

import { Complex } from './handlers/complex-monkey-patch.js';
import './handlers/boolean-monkey-patch.js';
import './handlers/function-monkey-patch.js';
import './handlers/string-monkey-patch.js';
import './handlers/function-object-monkey-patch.js';
import './handlers/array-function-object-monkey-patch.js';

import { allOperators, implementedTypes, operationHandlers } from './monkey-patch-handlers.js';
import type { OperationHandler, OperationNode } from './monkey-patch-handlers.js';

type PatchedPrototype = Record<string, (this: unknown, other?: unknown) => unknown>;

for (const type of implementedTypes) {
  const prototype = type.prototype as unknown as PatchedPrototype;
  for (const operator in allOperators) {
    prototype[operator] = function (this: unknown, other?: unknown): unknown {
      let thisValue: unknown = this;
      if (this === null) {
        thisValue = Complex(0);
      }
      let otherValue = other;
      if (otherValue === null) {
        otherValue = Complex(0);
      }
      const firstType = (typeof thisValue === 'object' && thisValue instanceof Complex) ?
        'complex' : thisValue instanceof Object
          ? (thisValue as object).constructor.name.toLowerCase()
          : typeof thisValue;
      if (otherValue === undefined) {
        const unaryOperationNode = operationHandlers[firstType] as OperationNode;
        const unaryOperation = typeof unaryOperationNode === 'object'
          ? (unaryOperationNode as Record<string, unknown>)[operator]
          : undefined;
        if (typeof unaryOperation === 'function') {
          return (unaryOperation as OperationHandler).call(thisValue);
        }
        return operationHandlers.default(firstType, operator, 'undefined');
      }
      const secondType = (typeof otherValue === 'object' && otherValue instanceof Complex) ?
        'complex' : otherValue instanceof Object
          ? (otherValue as object).constructor.name.toLowerCase()
          : typeof otherValue;

      const typeHandlers = operationHandlers[firstType] as Record<string, unknown>;
      const operatorHandlers = typeHandlers[operator] as Record<string, unknown> | undefined;
      const operation = operatorHandlers?.[secondType];
      if (typeof operation === 'function') {
        return (operation as OperationHandler).call(thisValue, otherValue);
      }
      return operationHandlers.default(firstType, operator, secondType);
    };
  }
}
