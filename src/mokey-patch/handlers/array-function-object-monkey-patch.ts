import { Complex } from 'complex.js';
import lodash from 'lodash';
import { allOperators, implementedTypes, operationHandlers } from '../monkey-patch-handlers.js';
import { ArrayFunctionObject, arrayObject } from '../../function-object/array-function-object.js';
import type { Complex as ComplexInstance } from 'complex.js';

interface ArrayFunctionValue {
  indexArray: ComplexInstance[];
  _call(index: ComplexInstance): unknown;
  assign(cacheArgs: ComplexInstance[], cacheValue: unknown): unknown;
}

for (const operator in allOperators) {
  lodash.set(operationHandlers, `arrayfunctionobject.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(ArrayFunctionObject);

const Operators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', equals: '==', notEquals: '!='
};

for (const operator in Operators) {
  lodash.set(operationHandlers, `arrayfunctionobject.${operator}.arrayfunctionobject`, function (this: ArrayFunctionValue, other: ArrayFunctionValue) {
    try {
      const allIndex = this.indexArray.concat(other.indexArray.filter(item =>
        !this.indexArray.some(existingItem => existingItem.equals(item))));
      const result = new ArrayFunctionObject();
      for (const index of allIndex) {
        const value1 = this._call(index) ?? new Complex(0);
        const value2 = other._call(index) ?? new Complex(0);
        const value = (value1 as unknown as Record<string, (value: unknown) => unknown>)[operator](value2);
        result.assign([index], value);
      }
      return result;
    } catch (error) {
      throw new Error(`Unsupported ${operator} for function ${String(other)}`);
    }
  });

  lodash.set(operationHandlers, `arrayfunctionobject.${operator}.complex`, function (this: (...args: unknown[]) => unknown, other: unknown) {
    return arrayObject((...args: unknown[]) => {
      const result = this(...args) as unknown as Record<string, (value: unknown) => unknown>;
      return result[operator](other);
    });
  });
}

lodash.set(operationHandlers, 'arrayfunctionobject.add.string', function (this: (...args: unknown[]) => unknown, other: string) {
  return arrayObject((...args: unknown[]) => {
    const result = this(...args) as unknown as { add: (value: unknown) => unknown };
    return result.add(other);
  });
});

lodash.set(operationHandlers, 'arrayfunctionobject.not', function (this: (...args: unknown[]) => unknown) {
  return arrayObject((...args: unknown[]) => {
    const result = this(...args) as unknown as { not: () => unknown };
    return result.not();
  });
});

lodash.set(operationHandlers, 'arrayfunctionobject.neg', function (this: (...args: unknown[]) => unknown) {
  return arrayObject((...args: unknown[]) => {
    const r = this(...args);
    if (r !== null && r !== undefined && typeof r === 'object' && 'neg' in r) {
      const negatable = r as unknown as { neg: () => unknown };
      return negatable.neg();
    }
    return -(r as never as number);
  });
});

lodash.set(operationHandlers, 'arrayfunctionobject.equals.arrayfunctionobject', function (this: unknown, other: unknown) {
  return this === other;
});

lodash.set(operationHandlers, 'arrayfunctionobject.notEquals.arrayfunctionobject', function () {
  return true;
});
