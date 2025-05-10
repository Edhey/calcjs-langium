import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { AssignmentExpression, Expression, Identifier, isArrayLiteral, isIdentifier, isObjectLiteral, type BinaryExpression, type CalcScriptAstType, type CallLiteral, type FunctionDeclaration } from './generated/ast.js';
import type { CalcScriptServices } from './calc-script-module.js';
import { JavaScriptTranspiler } from '../code-generation/transpile.js';
// import * as supportLib from '../code-generation/support-lib.js';
// const dependenciesNames = Object.keys(supportLib);
const reservedWords = ['class'];
const assignableTypes = [isIdentifier, isArrayLiteral, isObjectLiteral];
import { operationHandlers } from '../mokey-patch/monkey-patch-handlers.js';
import '../mokey-patch/monkey-patch.js';
import lodash from 'lodash';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CalcScriptServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.CalcScriptValidator;
  const checks: ValidationChecks<CalcScriptAstType> = {
    Identifier: validator.checkIdentifierNotReserved,
    BinaryExpression: validator.checkDivByZero,
    CallLiteral: validator.checkCallLiteral,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CalcScriptValidator {
  checkIdentifierNotReserved(node: Identifier, accept: ValidationAcceptor): void {
    const reserved = ['class'];
    if (node.name && reserved.includes(node.name)) {
      accept('error', `Identifier '${node.name}' is a reserved word.`, {
        node,
        property: 'name'
      });
    }
  }

  checkDivByZero(binExpr: BinaryExpression, accept: ValidationAcceptor): void {
    if ((binExpr.operator === '/') && JavaScriptTranspiler.transpileExpression(binExpr.right) === 'Complex(\'0\')') {
      accept('error', 'You can not divide by 0.', { node: binExpr, property: 'right' });
    }
  }

  checkCallLiteral(callLiCallLiteral: CallLiteral, accept: ValidationAcceptor): void {

  }

  checkBinaryExpressionTypes(binExpr: BinaryExpression, accept: ValidationAcceptor): void {
    const leftType = this.inferType(binExpr.left);
    const rightType = this.inferType(binExpr.right);
    const operator = JavaScriptTranspiler.transpileOperator(binExpr.operator);
    try {
      // const operation = lodash.get(operationHandlers, `${leftType}.${operator}.${rightType}`);
      const operation = lodash.get(operationHandlers, `${leftType}.${operator}.${rightType}`);
      console.log('operation', operation);
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
    if (expr.$type === 'NumberLiteral') return 'complex';
    if (expr.$type === 'StringLiteral') return 'string';
    if (expr.$type === 'BooleanLiteral') return 'boolean';
    if (expr.$type === 'ArrayLiteral') return 'object';
    if (expr.$type === 'ObjectLiteral') return 'object';
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
    }
  }

  checkAssignment(assignment: AssignmentExpression, accept: ValidationAcceptor): void {
    if (assignment.operator !== '=') {
      accept('error', `Assignment operator '${assignment.operator}' is not supported.`, { node: assignment, property: 'operator' });
    }
    if (!assignableTypes.some(type => type(assignment.left))) {
      accept('error', `Left side of assignment must be an identifier, array or object literal.`, { node: assignment, property: 'left' });
    }
  }
}
