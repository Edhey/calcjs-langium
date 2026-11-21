import { Complex } from 'complex.js';
import lodash from 'lodash';
import { allOperators, implementedTypes, operationHandlers } from '../monkey-patch-handlers.js';
import { functionObject } from '../../function-object/function-object.js';

for (const operator in allOperators) {
  lodash.set(operationHandlers, `boolean.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(Boolean);

const BasicBooleanOperators = {
  add: '+', sub: '-', equals: '==', notEquals: '!='
};

for (const op in BasicBooleanOperators) {
  lodash.set(operationHandlers, `boolean.${op}.boolean`, function (this: boolean, other: boolean) {
    const complexThis = Complex(Number(this));
    return (complexThis as unknown as Record<string, (value: unknown) => unknown>)[op](Complex(Number(other)));
  });

  lodash.set(operationHandlers, `boolean.${op}.functionobject`, function (this: boolean, other: (...args: unknown[]) => unknown) {
    try {
      return functionObject((...args: unknown[]) => {
        const current = this as unknown as Record<string, (value: unknown) => unknown>;
        return current[op](other(...args));
      });
    } catch (error) {
      throw new Error(`Unsupported ${op} for function ${String(other)}`);
    }
  });

  lodash.set(operationHandlers, `boolean.${op}.complex`, function (this: boolean, other: unknown) {
    return (Complex(Number(this)) as unknown as Record<string, (value: unknown) => unknown>)[op](other);
  });
}

lodash.set(operationHandlers, 'boolean.add.string', function (this: boolean, other: string) {
  return this.toString() + other;
});

lodash.set(operationHandlers, 'boolean.not', function (this: boolean) {
  return this === false;
});
