import lodash from 'lodash';
import { allOperators, implementedTypes, operationHandlers } from '../monkey-patch-handlers.js';
import { functionObject } from '../../function-object/function-object.js';
import type { Complex as ComplexInstance } from 'complex.js';

for (const operator in allOperators) {
  lodash.set(operationHandlers, `string.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(String);

const comparisonOperators = {
  equals: '==',
  notEquals: '!=',
  lessThan: '<',
  greaterThan: '>',
  lessThanOrEqual: '<=',
  greaterThanOrEqual: '>='
};

for (const operator in comparisonOperators) {
  lodash.set(operationHandlers, `string.${operator}.string`, function (this: string, other: string) {
    switch (operator) {
      case 'equals': return this == other;
      case 'notEquals': return this != other;
      case 'lessThan': return this < other;
      case 'greaterThan': return this > other;
      case 'lessThanOrEqual': return this <= other;
      case 'greaterThanOrEqual': return this >= other;
      default: throw new Error(`Unsupported operator: ${operator}`);
    }
  });
}

lodash.set(operationHandlers, 'string.not', function (this: string) {
  return this == '';
});

lodash.set(operationHandlers, 'string.add.string', function (this: string, other: string) {
  return this + other;
});

lodash.set(operationHandlers, 'string.add.functionobject', function (this: string, other: (...args: unknown[]) => unknown) {
  try {
    return functionObject((...args: unknown[]) => {
      const callableString = this as unknown as Record<string, (value: unknown) => unknown>;
      return callableString.add(other(...args));
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error: Unsupported add for type ${typeof other} with ${message}`);
  }
});

lodash.set(operationHandlers, 'string.add.boolean', function (this: string, other: boolean) {
  return this + other.toString();
});

lodash.set(operationHandlers, 'string.add.complex', function (this: string, other: ComplexInstance) {
  return this + other.toString();
});

lodash.set(operationHandlers, 'string.mul.complex', function (this: string, other: ComplexInstance) {
  if (other.im !== 0) {
    throw new Error(`Error: Unsupported mul for type ${typeof other} with imaginary part`);
  }
  return this.repeat(other.re);
});

lodash.set(operationHandlers, 'string.equals.complex', function () {
  return false;
});

const Operators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', equals: '==', notEquals: '!=',
  lessThan: '<', greaterThan: '>', lessThanOrEqual: '<=', greaterThanOrEqual: '>='
};

const stringPrototype = String.prototype as unknown as Record<string, (this: string, other?: unknown) => unknown>;
for (const op in Operators) {
  stringPrototype[op] = function (this: string, other?: unknown): unknown {
    if (other) {
      const handler = lodash.get(operationHandlers, `string.${op}.${typeof other}`) as ((this: string, value: unknown) => unknown) | undefined;
      return handler?.call(this, other);
    }
    const handler = lodash.get(operationHandlers, `string.${op}`) as ((this: string, value: unknown) => unknown) | undefined;
    return handler?.call(this, other);
  };
}
