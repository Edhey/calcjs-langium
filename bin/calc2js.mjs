#!/usr/bin/env node

/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Este archivo contiene el código para la ejecución del programa que
 *       convierte una expresión aritmética en un programa en JavaScript
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

import { program } from "commander";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
import { transpile } from "../src/transpile.js";

program
  .version(version)
  .showSuggestionAfterError()
  .argument("<file>", "file with the original code to transpile")
  .option("-o, --output <filename>", "file to write the transpiled code")
  .option("-v, --verbose", "show the generated code")
  .option("-a, --ast", "shows the AST")
  .option("-s, --scope", "shows the scope")
  .option("-D, --definitions", "shows the definition of the variables")
  .option("-r, --run", "run the generated code")
  .option("-re, --return", "shows the value of the last sentence")
  .option("-S, --string", "shows the value of the last sentence as a string")
  .description("Transpile an arithmetic expression into a JavaScript program")
  .action(async (file, options) => {
    const transpileResult = await transpile(file, options);
    if (options.run | options.string | options.return) {
      const output = await eval(transpileResult);
      if (options.string) {
        try {
          console.log(output.toString());
        } catch (error) {
          if (output !== undefined) {
            console.log(output);
          }
        }
      } else if (options.return) {
        console.log(output !== undefined ? output : "");
      }
    }
  });

// write the code to parse process.argv;
program.parse(process.argv);

export default program;