/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 * 
 * @autor Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Clase Scope que permite
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 *
 */

import {
  buildIdentifier,
  buildVariableDeclaration,
  buildVariableDeclarator
} from './ast-build.cjs';

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
    this.used = new Set(); // Set of name of used variables
    this.definitions = new Map(); // Map (name -> AssignExpression)
    this.scope = new Map(); // Map (name ->{declaration: AssignExpression, usages: [Identifier]})
    this.usedBeforeDeclaration = []; // Array of Identifier nodes
    this.letDeclarations = []; // Array of VariableDeclarator nodes
  }

  /**
   * Adds a variable to the scope and marks it as initialized.
   * @param {string} name - The name of the variable to add.
   */
  add(name) {
    this.setAsInitialized(name);
    this.letDeclarations.push(buildVariableDeclarator(buildIdentifier(name)));
  }

  /**
   * Adds a variable definition to the scope.
   * @param {Object} node - The AST node representing the variable definition.
   */
  addDefinition(node) {
    const name = node.left.name;
    this.definitions.set(name, node);
    this.add(name);
    this.scope.set(name, { declaration: node, usage: [] });
  }

  /**
   * Adds a variable usage to the scope.
   * @param {Object} node - The AST node representing the variable usage.
   */
  addUsage(node) {
    const name = node.name;
    if (this.scope.get(name) === undefined) {
      this.scope.set(name, { declaration: null, usage: [node] });
    } else {
      this.scope.get(name).usage.push(node);
    }
    this.setAsUsed(name);
    let parentScope = this.parent;
    if (parentScope?.has(name)) {
      parentScope.addUsage(node);
    }
  }

  /**
   * Marks a variable as initialized.
   * @param {string} name - The name of the variable to mark as initialized.
   */
  setAsInitialized(name) {
    this.initialized.add(name);
  }

  /**
   * Marks a variable as used.
   * @param {string} name - The name of the variable to mark as used.
   */
  setAsUsed(name) {
    this.used.add(name);
  }

  /**
   * Marks a variable as used before declaration.
   * @param {string} node - The AST node representing the variable usage.
   */
  setAsUsedBeforeDeclaration(node) {
    this.usedBeforeDeclaration.push(node);
  }

  /**
   * Checks if a variable is declared in the current scope or any parent scope.
   * @param {string} name - The name of the variable to check.
   * @returns {boolean} - True if the variable is declared, false otherwise.
   */
  isDeclaredInParentScope(name) {
    let parentScope = this.parent;
    while (parentScope) {
      if (parentScope.has(name)) {
        return true;
      }
      parentScope = parentScope.parent;
    }
    return false;
  }

  /**
   * Checks if a variable is initialized in the current scope.
   * @param {string} name - The name of the variable to check.
   * @returns {boolean} - True if the variable is initialized, false otherwise.
   */
  has(name) {
    return this.initialized.has(name);
  }

  /**
   * Builds a variable declaration statement for all let declarations in the scope.
   * @returns {Object} - The AST node representing the variable declaration.
   */
  buildDeclaration() {
    return buildVariableDeclaration(this.letDeclarations);
  }

  /**
   * Returns the variables that are declared but not used
   * @returns {Set} set of not used variables
   */
  notUsedVariables() {
    return this.initialized.difference(this.used);
  }

  /**
   * Returns the variables that are declared but not used as an array
   * of strings
   * @returns {String[]} array of strings with the not used variables
   */
  notUsedVariablesAnalysis() {
    let messages = [];
    for (const variable of this.notUsedVariables()) {
      if (typeof variable === 'undefined') continue;
      const line = this.scope.get(variable).declaration.loc?.first_line ?? this.scope.get(variable).declaration.loc?.start.first_line ?? 'unknow';
      const column = this.scope.get(variable).declaration.loc?.last_column ?? this.scope.get(variable).declaration.loc?.start.last_column ?? 'unknow';
      messages.push(`Variable ${variable} declared but not used at line ${line}, column ${column}`);
    }
    return this.showVariableErrorMessages(messages);
  }

  /**
   * Returns the variables that are used but not declared
   * @returns {Set} set of not declared variables
   */
  notDeclaredVariables() {
    return this.used.difference(this.initialized);
  }

  /**
   * Returns the message with the variables that are declared but not used as an
   * array of strings
   * @returns {String[]} array of strings with the not used variables
   */
  notDeclaredVariablesAnalysis() {
    let messages = [];
    for (const variable of this.notDeclaredVariables()) {
      if (this.isDeclaredInParentScope(variable)) continue;
      const line = this.scope.get(variable).usage[0].loc?.first_line ?? this.scope.get(variable).usage[0].loc?.start.first_line ?? 'unknow'
      const column = this.scope.get(variable).usage[0].loc?.last_column ?? this.scope.get(variable).usage[0].loc?.start.last_column ?? 'unknow'
      messages.push(`Variable ${variable} not declared at line ${line}, column ${column}`);    }
    return this.showVariableErrorMessages(messages);
  }

  /**
   * Returns the message with the variables that are used before declaration
   * @returns {Set} set of variables used before declaration
   */
  usedBeforeDeclarationVariablesAnalysis() {
    let messages = [];
    const usedBeforeDeclaration = this.usedBeforeDeclaration.filter(
                          node => !this.notDeclaredVariables().has(node.name));
    for (const node of usedBeforeDeclaration) {
      messages.push(`Variable ${node.name} used before declaration at line` +
        ` ${node.loc.first_line}, column ${node.loc.last_column}`);
    }
    return this.showVariableErrorMessages(messages);
  }

  /**
   * Helper function to show the errors related with variables
   * @param {String[]} messages - array of strings with the error messages
   * @returns {String} string with the error messages or null if there are no 
   * errors
   */
  showVariableErrorMessages(messages) {
    if (messages.length > 0) {
      return messages.map(message => message.replace(/\$/, '')).join('\n');
    }
    return null;
  }

  showErrorMessages(name) {
    let notDeclaredMessage = this.notDeclaredVariablesAnalysis();
    let notUsedMessage = this.notUsedVariablesAnalysis();
    let usedBeforeDeclarationMessage = this.usedBeforeDeclarationVariablesAnalysis();
    let message = '';
    if (notDeclaredMessage) {
      message += notDeclaredMessage + '\n';
    }
    if (notUsedMessage) {
      message += notUsedMessage + '\n';
    }
    if (usedBeforeDeclarationMessage) {
      message += usedBeforeDeclarationMessage + '\n';
    }
    if (message) {
      if (name) {
        console.error("Errors in " + name  + " scope:");
      } else {
        console.error("Errors in scope:");
      }
      console.error(message);
    }
  }

  /**
   * Returns the number of variables declared in the scope
   * @returns {Number} number of variables declared in the scope
   */
  get length() {
    return this.letDeclarations.length;
  }
}