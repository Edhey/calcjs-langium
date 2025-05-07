// /**
//  * Universidad de La Laguna
//  * Escuela Superior de Ingeniería y Tecnología
//  * Grado en Ingeniería Informática
//  * Asignatura Procesadores de Lenguajes
//  * TFA - Langium Syntaxis and Errors for Calculator
//  *
//  * @autor Himar Edhey Hernández Alonso
//  * @since Fri 28 Feb 2025
//  * @desc Este archivo contiene los tests de los errores de la práctica
//  * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
//  */

// import { JavaScriptTranspiler } from "../src/code-generation/transpile.js";
// import * as fileStream from "fs/promises";
// import { expect } from "chai";
// import { createCalcScriptServices } from "../src/language/calc-script-module.js";
// import { extractAstNode } from "../src/cli/cli-util.js";
// import { Model } from "../src/language/generated/ast.js";
// import { NodeFileSystem } from "langium/node";
// const services = createCalcScriptServices(NodeFileSystem).CalcScript;

// interface TestFiles {
//   input: string;
//   output: string;
//   expected: string;
//   correctOut?: string;
//   correctErr?: string;
// }

// /**
//  * Remove spaces and requires from the code
//  * @param code Input code to remove spaces and requires
//  * @returns Code without spaces and requires
//  */
// function removeSpaces(code: string): string {
//   return code.replace(/\s/g, '').replace(/^.*\/\*endofpreambleofgeneratedcode\*\//, '');
// }

// /**
//  * Function that executes the transpile function and checks the output result
//  * removing spaces and requires
//  * @param testsFiles Object with the input, output, expectedjs and correctout files
//  * @param unlink If true, it will delete the output file after checking
//  */
// async function checkTranspile(testsFiles: TestFiles, unlink = false): Promise<void> {
//   // Compile the input and check the output program is what expected
//   const model = await extractAstNode<Model>(testsFiles.input, services);
//   const jsCode = await JavaScriptTranspiler.transpile(model);
//   await fileStream.writeFile(testsFiles.output, jsCode);
//   const output = await fileStream.readFile(testsFiles.output, 'utf-8');
//   const expected = await fileStream.readFile(testsFiles.expected, 'utf-8');
//   expect(removeSpaces(output)).to.equal(removeSpaces(expected));
//   if (unlink) await fileStream.unlink(testsFiles.output);
// }

// /**
//  * Function that executes the run function and checks the output result
//  * removing spaces and requires. It uses mocking to check the console.log
//  * @param testsFiles Object with the input, output, expectedjs and correctout files
//  * @param verbose If true, it will show the console.log output
//  */
// async function checkRunConsoleLog(testsFiles: TestFiles, verbose = false): Promise<void> {
//   let consoleOutput = "";
//   const oldLog = console.log; // Mock console.log
//   console.log = (output: string) => { consoleOutput += output; };
//   let correctOut: string | undefined;

//   // Transpile the input and receive the output in the result variable
//   try {
//     const model = await extractAstNode<Model>(testsFiles.input, services);
//     const transpileResult = await JavaScriptTranspiler.transpile(model);
//     const evaluatedCode = await eval(transpileResult);
//     correctOut = await fileStream.readFile(testsFiles.correctOut!, 'utf-8');
//     // If there is no print in the code, the last sentence is the result
//     if (consoleOutput === "") consoleOutput = evaluatedCode.toString();
//   } catch (error) {
//     console.error(error);
//   } finally {
//     console.log = oldLog; // Restore console.log
//   }

//   expect(removeSpaces(consoleOutput)).to.equal(removeSpaces(correctOut!));
// }

// /**
//  * Function that executes the run function and checks the error output
//  * @param testsFiles Object with the input, output, expectedjs and correcterr files
//  */
// async function checkRunConsoleError(testsFiles: TestFiles): Promise<void> {
//   let consoleOutput = "";
//   const originalConsoleError = console.error; // Mock console.error
//   console.error = (message: string) => { consoleOutput += message; };
//   const correctErr = await fileStream.readFile(testsFiles.correctErr!, 'utf-8');

//   try {
//     const model = await extractAstNode<Model>(testsFiles.input, services);
//     const output = await JavaScriptTranspiler.transpile(model);
//     expect(removeSpaces(output)).to.equal(removeSpaces(correctErr));
//   } catch (error: any) {
//     await fileStream.writeFile(testsFiles.output, error.message);
//     expect(removeSpaces(consoleOutput)).to.equal(removeSpaces(correctErr));
//   } finally {
//     console.error = originalConsoleError; // Restore console.error
//   }
// }

// export {
//   removeSpaces,
//   checkTranspile,
//   checkRunConsoleLog,
//   checkRunConsoleError
// };