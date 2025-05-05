import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { CalcScriptAstType, Expression } from './generated/ast.js';
import type { CalcScriptServices } from './calc-script-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CalcScriptServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.CalcScriptValidator;
  const checks: ValidationChecks<CalcScriptAstType> = {
    Expression: validator.checkIdentifierNotReserved
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CalcScriptValidator {

  checkIdentifierNotReserved(node: Expression, accept: ValidationAcceptor): void {
    const printerWords = ['print', 'write'];
    const reserved = ['fun', 'true', 'false', 'null', 'while', 'for', 'do'];
    if (node.name && reserved.includes(node.name)) {
      accept('error', `Identifier '${node.name}' is a reserved word.`, {
        node,
        property: 'name'
      });
    }
    if (node.name && printerWords.includes(node.name)) {
    }
  }

}
