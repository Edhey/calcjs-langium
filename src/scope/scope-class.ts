/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 * 
 * @autor Himar Edhey Hernández Alonso
 * @since 05/05/2025
 * @desc Scope class for managing variable declarations and usage in the AST.
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 *
 */

import type { Identifier } from '../language/generated/ast.js';

/**
 * Represents a scope in which variables can be declared, initialized, and used.
 * This class helps in tracking variable declarations and usage within a given scope.
 */
export class Scope {
  private initialized = new Set<string>();
  private usedBeforeDeclaration: Identifier[] = [];
  private usageCount = new Map<string, number>();

  has(name: string): boolean {
    return this.initialized.has(name);
  }

  setAsInitialized(name: string): void {
    this.initialized.add(name);
  }

  addUsage(id: Identifier): void {
    const name = id.name;
    const count = this.usageCount.get(name) || 0;
    this.usageCount.set(name, count + 1);
  }

  setAsUsedBeforeDeclaration(id: Identifier): void {
    this.usedBeforeDeclaration.push(id);
  }

  showErrorMessages(scopeName: string): void {
    for (const id of this.usedBeforeDeclaration) {
      console.error(`[${scopeName}] Variable '${id.name}' used before declaration.`);
    }
  }
}
