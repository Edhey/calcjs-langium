/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 19 Mar 2025
 * @desc Handler for operations
 * @see {@link https://github.com/Edhey/calcjs-langium}
 */

export type OperationHandler = (this: unknown, ...args: unknown[]) => unknown;
export type OperationNode = OperationHandler | Record<string, unknown>;

export interface OperationHandlers {
  default: (left: unknown, operator: string, right: unknown) => never;
  [typeName: string]: OperationNode | OperationHandler | ((left: unknown, operator: string, right: unknown) => never);
}

export interface PatchingType {
  prototype: object;
}

const operationHandlers: OperationHandlers = {
  default: (left: unknown, operator: string, right: unknown): never => {
    throw new Error(`Operation ${String(left)} ${operator} ${String(right)} not supported`);
  }
};

const AritmeticOperators = {
  add: '+', mul: '*', div: '/', pow: '**', sub: '-', neg: '-'
};

const ComparisonOperators = {
  equals: '==', notEquals: '!=', lessThan: '<', greaterThan: '>',
  lessEqualThan: '<=', greaterEqualThan: '>=', not: '!'
};

const allOperators = {
  ...AritmeticOperators,
  ...ComparisonOperators
};

const implementedTypes: PatchingType[] = [];

export {
  operationHandlers,
  implementedTypes,
  allOperators,
  AritmeticOperators,
  ComparisonOperators
};
