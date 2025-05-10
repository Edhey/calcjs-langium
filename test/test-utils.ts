/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @autor Himar Edhey Hernández Alonso
 * @since Fri 28 Feb 2025
 * @desc Este archivo contiene los tests de los errores de la práctica
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

import { exec } from 'node:child_process';
import type { ExecException } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, '../bin/cli');

interface CliResult {
  code: number,
  error: ExecException | null,
  stdout: string,
  stderr: string
}

interface TestFiles {
  input: string;
  output: string;
  expected: string;
  correctOut?: string;
  correctErr?: string;
}

/**
 * Remove spaces and requires from the code
 * @param code Input code to remove spaces and requires
 * @returns Code without spaces and requires
 */
export function removeSpaces(code: string): string {
  return code.replace(/\s/g, '').replace(/^.*\/\*endofpreambleofgeneratedcode\*\//, '');
}

/**
 * Function that executes the transpile function and checks the output result
 * removing spaces and requires
 * @param testsFiles Object with the input, output, expectedjs and correctout files
 * @param unlink If true, it will delete the output file after checking
 */
export async function checkTranspile(testsFiles: TestFiles): Promise<CliResult> {
  return new Promise(resolve => {
    const cmd = `node ${cliPath} "${testsFiles.input}" -v`;
    exec(cmd, async (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr
      });
    });
  });
}

/**
 * Function that executes the run function and checks the output result
 * removing spaces and requires. It uses mocking to check the console.log
 * @param testsFiles Object with the input, output, expectedjs and correctout files
 * @param verbose If true, it will show the console.log output
 */
export async function checkRunConsoleLog(testsFiles: TestFiles): Promise <CliResult> {
  return new Promise(resolve => {
    const cmd = `node ${cliPath} "${testsFiles.input}" -r`;
    exec(cmd, async (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr
      });
    });
  });
}

// /**
//  * Function that executes the run function and checks the error output
//  * @param testsFiles Object with the input, output, expectedjs and correcterr files
//  */
// async function checkRunConsoleError(testsFiles) {
//   let consoleOutput = "";
//   const originalConsoleError = console.error; // Mock console.error
//   console.error = (message) => { consoleOutput += message; };
//   const correctErr = await fileStream.readFile(testsFiles.correctErr, 'utf-8');

//   try {
//     const services = createCalcScriptServices(NodeFileSystem).CalcScript;
//     const model = await extractAstNode<Model>(testsFiles.input, services);
//     const output = await JavaScriptTranspiler.transpile(model);
//     expect(removeSpaces(output)).to.equal(removeSpaces(correctErr));
//   } catch (error) {
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