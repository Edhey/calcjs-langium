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
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 *
 */

const operationHandlers = {
  'default': (left, operator, rigth) => {
    throw new Error(`Operation ${left} ${operator} ${rigth} not supported`);
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

const implementedTypes = [];

export { operationHandlers,
  implementedTypes,
  allOperators,
  AritmeticOperators,
  ComparisonOperators
};