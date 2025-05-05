// import type { Model, Expression, AssignmentExpression, Identifier } from '../language/generated/ast.js';
// import { isAssignmentExpression, isIdentifier } from '../language/generated/ast.js';
// import { Scope } from './scope-class.js';

// /**
//  * Recorre el AST y construye el scope de variables.
//  * Marca errores si se usan variables no definidas.
//  */
// export function scopeAnalysis(module: Model): Scope {
//   const scope = new Scope();

//   for (const expr of module.expressions) {
//     visitExpression(expr, scope);
//   }

//   scope.showErrorMessages("global");
//   return scope;
// }

// function visitExpression(expr: Expression, scope: Scope): void {
//   if (isAssignmentExpression(expr)) {
//     const name = expr.target;
//     if (name) {
//       scope.setAsInitialized(name);
//     }
//     visitExpression(expr.value, scope);
//   } else if (isIdentifier(expr)) {
//     const name = expr.name;
//     if (!scope.has(name)) {
//       scope.setAsUsedBeforeDeclaration(expr);
//     } else {
//       scope.addUsage(expr);
//     }
//   } else {
//     // Recorremos recursivamente si es un nodo con hijos (Binary, Unary, etc.)
//     for (const prop of Object.values(expr)) {
//       if (Array.isArray(prop)) {
//         prop.forEach(e => isExpression(e) && visitExpression(e, scope));
//       } else if (isExpression(prop)) {
//         visitExpression(prop, scope);
//       }
//     }
//   }
// }

// function isExpression(node: unknown): node is Expression {
//   return typeof node === 'object' && node !== null && 'type' in node;
// }
