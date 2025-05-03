#!/usr/bin/env node

/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Este archivo contiene el código para la ejecución del programa que
 *       convierte una expresión aritmética en un programa en JavaScript
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 *
 */

import { promises as fileStream } from 'fs';
import * as calc from '../calc.cjs';
const parser = calc.parser;
import { scopeAnalysis, findDependecies } from '../scope/scope.js';
import { codeGeneration } from './code-generation.js';
import { writeCode } from './write-code.js';

export {
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