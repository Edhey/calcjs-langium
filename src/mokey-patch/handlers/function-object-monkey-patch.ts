import { Complex } from 'complex.js';
import lodash from 'lodash';
import { allOperators, implementedTypes, operationHandlers } from '../monkey-patch-handlers.js';
import { FunctionObject, functionObject } from '../../function-object/function-object.js';

for (const operator in allOperators) {
  lodash.set(operationHandlers, `functionobject.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(FunctionObject);

const Operators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', equals: '==', notEquals: '!='
};

for (const operator in Operators) {
  lodash.set(operationHandlers, `functionobject.${operator}.boolean`, function (this: (...args: unknown[]) => unknown, other: boolean) {
    return functionObject((...args: unknown[]) => {
      const result = this(...args) as unknown as Record<string, (value: unknown) => unknown>;
      return result[operator](Complex(Number(other)));
    });
  });

  lodash.set(operationHandlers, `functionobject.${operator}.functionobject`, function (this: (...args: unknown[]) => unknown, other: (...args: unknown[]) => unknown) {
    try {
      return functionObject((...args: unknown[]) => {
        const result = this(...args) as unknown as Record<string, (value: unknown) => unknown>;
        return result[operator](other(...args));
      });
    } catch (error) {
      throw new Error(`Unsupported ${operator} for function ${String(other)}`);
    }
  });

  lodash.set(operationHandlers, `functionobject.${operator}.complex`, function (this: (...args: unknown[]) => unknown, other: unknown) {
    return functionObject((...args: unknown[]) => {
      const result = this(...args) as unknown as Record<string, (value: unknown) => unknown>;
      return result[operator](other);
    });
  });
}

lodash.set(operationHandlers, 'functionobject.add.string', function (this: (...args: unknown[]) => unknown, other: string) {
  return functionObject((...args: unknown[]) => {
    const result = this(...args) as unknown as { add: (value: unknown) => unknown };
    return result.add(other);
  });
});

lodash.set(operationHandlers, 'functionobject.not', function (this: (...args: unknown[]) => unknown) {
  return functionObject((...args: unknown[]) => {
    const result = this(...args) as unknown as { not: () => unknown };
    return result.not();
  });
});

lodash.set(operationHandlers, 'functionobject.neg', function (this: (...args: unknown[]) => unknown) {
  return functionObject((...args: unknown[]) => {
    const r = this(...args) as unknown as { neg?: () => unknown } | number;
    if (typeof r === 'number') return -r;
    return r?.neg?.() ?? -0;
  });
});

lodash.set(operationHandlers, 'functionobject.equals.functionobject', function (this: unknown, other: unknown) {
  return this === other;
});

lodash.set(operationHandlers, 'functionobject.notEquals.functionobject', function () {
  return true;
});
