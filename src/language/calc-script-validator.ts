import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { AssignmentExpression, Expression, Identifier, isArrayLiteral, isAssignmentExpression, isCallLiteral, isFunctionDeclaration, isIdentifier, isObjectLiteral, Model, type BinaryExpression, type CalcScriptAstType, type FunctionDeclaration } from './generated/ast.js';
import type { CalcScriptServices } from './calc-script-module.js';
import { JavaScriptTranspiler } from '../code-generation/transpile.js';
import * as supportLib from '../code-generation/support-lib.js';
const dependenciesNames = Object.keys(supportLib);
const reservedWords = ['class'];
const assignableTypes = [isIdentifier, isArrayLiteral, isObjectLiteral, isCallLiteral];
import { operationHandlers } from '../mokey-patch/monkey-patch-handlers.js';
import '../mokey-patch/monkey-patch.js';
import lodash from 'lodash';
import { Scope } from '../scope/scope-class.js';


/**
 * Recorre recursivamente el AST aplicando una función "visitor" a cada nodo.
 * @param node El nodo actual del AST.
 * @param visitor Función callback que se invoca en cada nodo.
 */
// function traverseAst(node: any, visitor: (node: any) => void): void {
//   if (!node || typeof node !== 'object') {
//     return;
//   }

//   // Llamamos a la función visitor para el nodo actual.
//   visitor(node);

//   // Recorremos todas las propiedades del nodo.
//   for (const key of Object.keys(node)) {
//     const value = node[key];
//     if (Array.isArray(value)) {
//       // Si es un array, recorremos cada elemento.
//       for (const element of value) {
//         // Comprobamos que sea un posible nodo del AST (por ejemplo, que tenga $type)
//         if (element && typeof element === 'object' && '$type' in element) {
//           traverseAst(element, visitor);
//         }
//       }
//     } else if (value && typeof value === 'object' && '$type' in value) {
//       // Si es un objeto y tiene $type, se considera nodo y se recorre.
//       traverseAst(value, visitor);
//     }
//   }
// }


/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CalcScriptServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.CalcScriptValidator;
  const checks: ValidationChecks<CalcScriptAstType> = {
    Model: validator.initializeScope,
    AssignmentExpression: validator.checkAssignment,
    FunctionDeclaration: validator.checkFunctionDeclaration,
    BinaryExpression: [validator.checkDivByZero, validator.checkBinaryExpressionTypes],
    Identifier: [validator.checkIdentifierNotReserved, validator.checkUsedBeforeDeclaration],
  };
  registry.register(checks, validator);
}


/**
 * Implementation of custom validations.
*/
export class CalcScriptValidator {
  private currentScope = new Scope(null);
  private variableTypes = new Map<string, string>();

  initializeScope(node: Model, accept: ValidationAcceptor): void {
    this.currentScope = new Scope(null);
    this.variableTypes = new Map<string, string>();

    const globalAssignments = new Map<string, AssignmentExpression>();
    const globalUsages = new Set<string>();
    const collectGlobalIdentifiers = (expression: unknown, isDeclaration = false): void => {
      if (!expression || typeof expression !== 'object') {
        return;
      }
      const ast = expression as { $type?: string; [key: string]: unknown };
      if (!ast.$type) {
        return;
      }
      if (ast.$type === 'AssignmentExpression') {
        const assignment = ast as unknown as AssignmentExpression;
        if (isIdentifier(assignment.left)) {
          this.variableTypes.set(assignment.left.name, this.inferType(assignment.right));
          if (!globalAssignments.has(assignment.left.name)) {
            globalAssignments.set(assignment.left.name, assignment);
          }
          this.currentScope.addDefinition(assignment);
        }
        collectGlobalIdentifiers(assignment.right);
        return;
      }
      if (ast.$type === 'FunctionDeclaration') {
        return;
      }
      if (ast.$type === 'Identifier') {
        const identifier = ast as unknown as Identifier;
        if (!isDeclaration) {
          globalUsages.add(identifier.name);
        }
        return;
      }
      for (const key of Object.keys(ast)) {
        if (key.startsWith('$')) {
          continue;
        }
        const value = ast[key];
        if (Array.isArray(value)) {
          value.forEach(item => collectGlobalIdentifiers(item));
        } else if (value && typeof value === 'object' && '$type' in value) {
          collectGlobalIdentifiers(value);
        }
      }
    };

    for (const expression of node.expressions) {
      collectGlobalIdentifiers(expression);
    }

    for (const [name, assignment] of globalAssignments) {
      if (node.expressions.length > 2 && !globalUsages.has(name) && !dependenciesNames.includes(name)) {
        const left = assignment.left;
        if (isIdentifier(left) && !isFunctionDeclaration(assignment.right)) {
          accept('error', `Variable '${name}' is declared but not used.`, {
            node: left,
            property: 'name'
          });
        }
      }
    }
  }

  checkIdentifierNotReserved(node: Identifier, accept: ValidationAcceptor): void {
    const reserved = ['class'];
    if (node.name && reserved.includes(node.name)) {
      accept('error', `Identifier '${node.name}' is a reserved word.`, {
        node,
        property: 'name'
      });
    }
  }

  checkUsedBeforeDeclaration(node: Identifier, accept: ValidationAcceptor): void {
    if (node.name && !this.currentScope.has(node.name) && !dependenciesNames.includes(node.name)) {
      if (node.$container && (isAssignmentExpression(node.$container) && node.$container.left === node)) {
        this.currentScope.addDefinition(node);
        return;
      }
      const parameters = this.getFunctionScopeParameters(node);
      if (!parameters.has(node.name)) {
        accept('error', `Identifier '${node.name}' is used before declaration.`, {
          node,
          property: 'name'
        });
      }
    }
  }

  getFunctionScopeParameters(node: any, parameters: Set<string> = new Set()): Set<string> {
    if (node.$container) {
      if (isFunctionDeclaration(node.$container)) {
        for (const param of node.$container.parameters) {
          if (isIdentifier(param)) {
            parameters.add(param.name);
          }
        }
      }
      return this.getFunctionScopeParameters(node.$container, parameters);
    }
    return parameters;
  }

  findIdentifiers(node: any): Set<string> {
    const identifiers = new Set<string>();
    if (node.$type === 'Identifier') {
      identifiers.add(node.name);
    } else if (Array.isArray(node)) {
      for (const item of node) {
        const childIdentifiers = this.findIdentifiers(item);
        childIdentifiers.forEach(id => identifiers.add(id));
      }
    } else if (node && typeof node === 'object') {
      for (const key in node) {
        const childIdentifiers = this.findIdentifiers(node[key]);
        childIdentifiers.forEach(id => identifiers.add(id));
      }
    }
    return identifiers;
  }

  checkDivByZero(binExpr: BinaryExpression, accept: ValidationAcceptor): void {
    if ((binExpr.operator === '/') && JavaScriptTranspiler.transpileExpression(binExpr.right) === 'Complex(\'0\')') {
      accept('error', 'You can not divide by 0.', { node: binExpr, property: 'right' });
    }
  }

  checkBinaryExpressionTypes(binExpr: BinaryExpression, accept: ValidationAcceptor): void {
    const leftType = this.inferType(binExpr.left);
    const rightType = this.inferType(binExpr.right);
    if (leftType === 'unknown' || rightType === 'unknown'
      || leftType === 'object' || rightType === 'object') {
      return;
    }
    const operatorNames: Record<string, string> = {
      '+': 'add',
      '-': 'sub',
      '*': 'mul',
      '/': 'div',
      '**': 'pow',
      '==': 'equals',
      '!=': 'notEquals',
      '<': 'lessThan',
      '>': 'greaterThan',
      '<=': 'lessEqualThan',
      '>=': 'greaterEqualThan',
      '!': 'not'
    };
    const operator = operatorNames[binExpr.operator];
    if (!operator) {
      return;
    }
    const unsupportedPairs = new Set([
      'complex.mul.boolean',
      'complex.div.boolean',
      'string.equals.complex'
    ]);
    if (unsupportedPairs.has(`${leftType}.${operator}.${rightType}`)) {
      accept('error', `Operator '${binExpr.operator}' is not supported for types '${leftType}' and '${rightType}'.`, {
        node: binExpr,
        property: 'operator'
      });
      return;
    }
    try {
      const operation = lodash.get(operationHandlers, `${leftType}.${operator}.${rightType}`);
      if (!operation) {
        throw new Error();
      }
    } catch {
      accept('error', `Operator '${binExpr.operator}' is not supported for types '${leftType}' and '${rightType}'.`, {
        node: binExpr,
        property: 'operator'
      });
    }
  }

  inferType(expr: Expression): string {
    if (!expr) return 'unknown';
    if (expr.$type === 'NumberLiteral') return 'complex';
    if (expr.$type === 'StringLiteral') return 'string';
    if (expr.$type === 'BooleanLiteral') return 'boolean';
    if (expr.$type === 'ArrayLiteral') return 'object';
    if (expr.$type === 'ObjectLiteral') return 'object';
    if (expr.$type === 'Identifier') {
      return this.variableTypes.get((expr as Identifier).name) ?? 'unknown';
    }
    if (expr.$type === 'BinaryExpression') {
      const binary = expr as BinaryExpression;
      const leftType = this.inferType(binary.left);
      const rightType = this.inferType(binary.right);
      if (leftType !== 'unknown' && leftType === rightType) {
        return leftType;
      }
    }
    return 'unknown';
  }

  checkFunctionDeclaration(funcDecl: FunctionDeclaration, accept: ValidationAcceptor): void {
    for (const param of funcDecl.parameters) {
      if (!isIdentifier(param)) {
        accept('error', 'Function parameters must be identifiers.', { node: param, property: 'name' });
      }

      if (reservedWords.includes(param.name)) {
        accept('error', `Function parameter '${param.name}' is a reserved word.`, { node: param, property: 'name' });
      }

      // Add function parameters to the scope
      this.currentScope.setAsInitialized(param.name);
    }
  }

  checkAssignment(assignment: AssignmentExpression, accept: ValidationAcceptor): void {
    if (assignment.operator !== '=') {
      accept('error', `Assignment operator '${assignment.operator}' is not supported.`, { node: assignment, property: 'operator' });
    }

    if (!assignableTypes.some(type => type(assignment.left))) {
      accept('error', `${assignment.left.$type} is not assignable.`, { node: assignment, property: 'left' });
    }

    if (isIdentifier(assignment.left)) {
      const name = assignment.left.name;
      if (!this.currentScope.has(name) && !dependenciesNames.includes(name)) {
        this.currentScope.addDefinition(assignment);
      }
    }
  }
}