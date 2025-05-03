import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { CalcScriptAstType, Person } from './generated/ast.js';
import type { CalcScriptServices } from './calc-script-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CalcScriptServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CalcScriptValidator;
    const checks: ValidationChecks<CalcScriptAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CalcScriptValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
