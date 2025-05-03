#!/usr/bin/env node

/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * Práctica 3 - Hello Compilers
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Este archivo contiene el código para la ejecución del programa que
 *       convierte una expresión aritmética en un programa en JavaScript
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 *
 */

const fileStream = require('fs').promises
const parser = require("./calc").parser;
const { scopeAnalysis, findDependecies } = require('./scope.js');
const { codeGeneration } = require('./code-generation.js');
const { writeCode } = require('./write-code.js');

module.exports = {
  transpile
};

/**
 * Transpile an arithmetic expression into a JavaScript program asynchronically
 * - Gets the code from the input file
 * - Parses the code to an AST
 * - Finds the used functions
 * - Generates the output code
 * - Writes the output code to the output file
 * @param {string} inputFile - file with the original code to transpile
 * @param {Object} options - options to transpile
 * @returns {string} - The output code
 */
async function transpile(inputFile, options) {
  let input;
  try {
    input = await fileStream.readFile(inputFile, 'utf-8')          // 1. Read the input file
  }
  catch (error) {
    console.error(`Can't read file "${inputFile}"`);
    return error;
  }

  let ast;
  try {
    ast = parser.parse(input); // 2. parse the input code
  } catch (error) {
    let message = error.message;
    console.error(message);
    return message;
  }

  ast = findDependecies(ast); // 3. find the dependencies
  ast = scopeAnalysis(ast); // 4. create the scope

  if (options.ast)
    console.log(JSON.stringify(ast, null, 2));

  if (options.definitions) {
    console.log("Definitions:");
    for (const [key, value] of ast.scope.definitions) {
      console.log(key + " -> " + JSON.stringify(value, null, 2));
    }
  }

  if (options.scope) {
    console.log("Scope:");
    for (const [key, value] of ast.scope.scope) {
      console.log(key + " -> " + JSON.stringify(value, null, 2));
    }
  }

  let output = await codeGeneration(ast); // 5. generate the output code (JS)

  await writeCode(output, options); // 6. write the output (JS code) to the output file
  return output;
}