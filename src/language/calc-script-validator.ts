import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { AssignmentExpression, Identifier, isArrayLiteral, isIdentifier, isObjectLiteral, type BinaryExpression, type CalcScriptAstType, type CallLiteral, type FunctionDeclaration } from './generated/ast.js';
import type { CalcScriptServices } from './calc-script-module.js';
import { JavaScriptTranspiler } from '../code-generation/transpile.js';
// import * as supportLib from '../code-generation/support-lib.js';
// const dependenciesNames = Object.keys(supportLib);
const reservedWords = ['class'];
const assignableTypes = [isIdentifier, isArrayLiteral, isObjectLiteral];

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CalcScriptServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.CalcScriptValidator;
  const checks: ValidationChecks<CalcScriptAstType> = {
    Identifier: validator.checkIdentifierNotReserved,
    BinaryExpression: validator.checkDivByZero
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
    if ((binExpr.operator === '/') && JavaScriptTranspiler.transpileExpression(binExpr.right) === 'Complex(0)') {
      accept('error', 'You can not divide by 0.', { node: binExpr, property: 'right' });
    }
  }

  checkCallLiteral(callLiCallLiteral: CallLiteral, accept: ValidationAcceptor): void {

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
