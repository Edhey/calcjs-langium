/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 * 
 * @autor Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Archivo que contiene la función dependencies que se encarga de detectar
 * las funciones de soporte que se utilizan
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

import astTypes from 'ast-types';
import * as supportLib from './support-lib.js';
import { Scope } from './scope-class.js';

const visit = astTypes.visit;

/**
 * Detect what support functions are used: dependency analysis
 * @param {Object} ast - The AST to analyze
 */
function findDependecies(ast) {
  const functionNames = Object.keys(supportLib);

  ast.dependencies = new Set([]);
  visit(ast.ast, {
    visitCallExpression(path) {
      const node = path.node;
      const name = node.callee.name;
      if (functionNames.includes(name)) {
        ast.dependencies.add(name);
      }
      this.traverse(path);
    }
  });
  return ast;
}

/**
 * Analize the scope of the AST
 * @param {Object} ast - The AST to analyze
 */
const scopeAnalysis = (ast) => {
  let currentScope = new Scope(null);

  visit(ast.ast, {
    visitFunction(path) {
      const node = path.node;
      if (node.type !== 'FunctionExpression') {
        this.traverse(path);
        return false;
      }
      const parentScope = currentScope;
      currentScope = new Scope(parentScope);

      // Add function parameters to the scope
      for (const param of node.params) {
        currentScope.setAsInitialized(param.name);
      }

      this.traverse(path);

      if (currentScope.length > 0) {
        node.body.body.unshift(currentScope.buildDeclaration());
      }

      currentScope.showErrorMessages("local anonymous function");

      currentScope = parentScope;
    },

    visitAssignmentExpression(path) {
      const node = path.node;
      const name = node.left?.name;
      if (
        node.left.type === 'Identifier' &&
        name &&
        !currentScope.has(name) &&
        !ast.dependencies.has(name) &&
        /^[$]/.test(name)
      ) {
        currentScope.addDefinition(node);
      }
      this.traverse(path);
    },

    visitIdentifier(path) {
      const parent = path.parent.node;
      const name = path.node.name;
      if (/^[$]/.test(name) && !ast.dependencies.has(name)) {
        if (!currentScope.has(name)) {
          currentScope.setAsUsedBeforeDeclaration(path.node);
        }
        if (!(parent.type === 'AssignmentExpression' && parent.left.name === name)) {
          currentScope.addUsage(path.node);
        }
      }
      this.traverse(path);
    }
  });

  if (currentScope.length > 0) {
    ast.ast.body.unshift(currentScope.buildDeclaration(ast.ast.loc));
  }

  ast.scope = currentScope;
  currentScope.showErrorMessages("global");
  return ast;
};

export {
  scopeAnalysis,
  findDependecies
};
