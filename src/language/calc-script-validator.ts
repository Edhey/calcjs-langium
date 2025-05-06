import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { BinaryExpression, CalcScriptAstType, CallLiteral, Identifier } from './generated/ast.js';
import type { CalcScriptServices } from './calc-script-module.js';
import { JavaScriptTranspiler } from '../code-generation/transpile.js';

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
}
