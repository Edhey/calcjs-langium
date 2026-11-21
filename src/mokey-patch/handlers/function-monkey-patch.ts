import { Complex } from 'complex.js';
import lodash from 'lodash';
import { allOperators, implementedTypes, operationHandlers } from '../monkey-patch-handlers.js';

for (const operator in allOperators) {
  lodash.set(operationHandlers, `function.${operator}`, Object.create(Object.prototype));
}
implementedTypes.push(Function);

const Operators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', equals: '==', notEquals: '!='
};

for (const operator in Operators) {
  lodash.set(operationHandlers, `function.${operator}.boolean`, function (this: (...args: unknown[]) => unknown, other: boolean) {
    return (...args: unknown[]) => {
      const result = this(...args) as unknown as Record<string, (value: unknown) => unknown>;
      return result[operator](Complex(Number(other)));
    };
  });

  lodash.set(operationHandlers, `function.${operator}.function`, function (this: (...args: unknown[]) => unknown, other: (...args: unknown[]) => unknown) {
    try {
      return (...args: unknown[]) => {
        const result = this(...args) as unknown as Record<string, (value: unknown) => unknown>;
        return result[operator](other(...args));
      };
    } catch (error) {
      throw new Error(`Unsupported ${operator} for function ${String(other)}`);
    }
  });

  lodash.set(operationHandlers, `function.${operator}.complex`, function (this: (...args: unknown[]) => unknown, other: unknown) {
    return (...args: unknown[]) => {
      const result = this(...args) as unknown as Record<string, (value: unknown) => unknown>;
      return result[operator](other);
    };
  });
}

lodash.set(operationHandlers, 'function.add.string', function (this: (...args: unknown[]) => unknown, other: string) {
  return (...args: unknown[]) => {
    const result = this(...args) as unknown as { add: (value: unknown) => unknown };
    return result.add(other);
  };
});

lodash.set(operationHandlers, 'function.not', function (this: (...args: unknown[]) => unknown) {
  return (...args: unknown[]) => {
    const result = this(...args) as unknown as { not: () => unknown };
    return result.not();
  };
});

lodash.set(operationHandlers, 'function.neg', function (this: (...args: unknown[]) => unknown) {
  return (...args: unknown[]) => {
    const r = this(...args);
    if (r !== null && r !== undefined && typeof r === 'object' && 'neg' in r) {
      const negatable = r as unknown as { neg: () => unknown };
      return negatable.neg();
    }
    return -(r as never as number);
  };
});
