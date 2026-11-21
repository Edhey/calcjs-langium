/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 * 
 * @autor Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Clase Scope simplificada para el análisis de variables en el nuevo AST.
 * @see {@link https://github.com/Edhey/calcjs-langium}
 *
 */

/**
 * Represents a scope in which variables can be declared, initialized, and used.
 * This class helps in tracking variable declarations and usage within a given scope.
 */
export class Scope {
  /**
   * Creates an instance of Scope.
   * @param {Scope|null} parent - The parent scope, or null if this is the root scope.
   */
  constructor(parent) {
    this.parent = parent;
    this.initialized = new Set(); // Set of name of initialized variables
    this.definitions = new Map(); // Map (name -> AssignExpression)
    this.scope = new Map(); // Map (name ->{declaration: AssignExpression, usages: [Identifier]})
  }

  /**
   * Adds a variable definition to the scope.
   * @param {Object} node - The AST node representing the variable definition.
   */
  addDefinition(node) {
    const name = node.left.name;
    this.definitions.set(name, node);
    this.setAsInitialized(name);
    this.scope.set(name, { declaration: node, usage: [] });
  }

  /**
   * Marks a variable as initialized.
   * @param {string} name - The name of the variable to mark as initialized.
   */
  setAsInitialized(name) {
    this.initialized.add(name);
  }

  /**
   * Checks if a variable is initialized in the current scope.
   * @param {string} name - The name of the variable to check.
   * @returns {boolean} - True if the variable is initialized, false otherwise.
   */
  has(name) {
    return this.initialized.has(name);
  }
}