// import { isFunctionCall, isBinaryExpression, isIdentifier } from './generated/ast.js';
// import type { Expression, Module } from './generated/ast.js';
// import Scope from './scope-class'; // Asegúrate de adaptarlo a TS

// export function findDependencies(moduleAst: Module): Set<string> {
//   const supportFunctionNames = Object.keys(require("./support-lib.js"));
//   const dependencies = new Set<string>();
//   // Aquí recorres el AST. Puedes escribir una función recursiva o usar un 'visitor'
//   function visit(node: Expression): void {
//     // Por ejemplo, si es una llamada a función y el identificador callee está en supportFunctionNames:
//     if (isFunctionCall(node)) {
//       const name = node.func.ref.name; // o donde tengas el nombre del callee
//       if (supportFunctionNames.includes(name)) {
//         dependencies.add(name);
//       }
//       // Recorre los argumentos
//       node.args.forEach(arg => visit(arg));
//     } else if (isBinaryExpression(node)) {
//       visit(node.left);
//       visit(node.right);
//     } else if (isIdentifier(node)) {
//       // Otras lógicas
//     } else {
//       // Para otras expresiones, como literales, paréntesis, etc.
//       // si node tiene sub-expresiones, recórrelas.
//     }
//   }
//   moduleAst.statements.forEach(expr => visit(expr));
//   return dependencies;
// }

// export function performScopeAnalysis(moduleAst: Module): Scope {
//   // Suponiendo que habrás adaptado tu Scope a TypeScript
//   const scope = new Scope(null);
//   // Aquí recorres el AST de manera similar a la versión Jison, usando un visitor.
//   // Por ejemplo:
//   function visit(node: Expression): void {
//     // Si es una declaración, agregarla al scope
//     // if (isAssignmentExpression(node)) { ... }
//     // Si es un identificador, verificar que esté declarado, etc.
//     // Recuerda que tendrás que adaptar las comprobaciones de "used", "initialized", etc.
//   }

//   moduleAst.statements.forEach(expr => visit(expr));
//   return scope;
// }
