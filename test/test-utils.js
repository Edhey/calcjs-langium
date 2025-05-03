/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * Práctica 3 - Hello Compilers
 *
 * @autor Himar Edhey Hernández Alonso
 * @since Fri 28 Feb 2025
 * @desc Este archivo contiene los tests de los errores de la práctica
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

const { transpile } = require("../src/transpile.js");
const fileStream = require("fs/promises");
const { expect } = require('chai');

/**
 * Remove spaces and requires from the code
 * @param {string} code Input code to remove spaces and requires
 * @returns {string} Code without spaces and requires
 */
function removeSpaces(string) {
  return string.replace(/\s/g, '').
    replace(/^.*\/\*endofpreambleofgeneratedcode\*\//, '');
}

/**
 * Function that executes the transpile function and checks the output result
 * removing spaces and requires
 * @param {Object} testsFiles Object with the input, output, expectedjs and 
 * correctout files 
 * @param {boolean} unlink If true, it will delete the output file after 
 * checking
 */
async function checkTranspile(testsFiles, unlink = false) {
  // Compile the input and check the output program is what expected
  await transpile(testsFiles.input, { output: testsFiles.output });
  let output = await fileStream.readFile(testsFiles.output, 'utf-8');
  let expected = await fileStream.readFile(testsFiles.expected, 'utf-8');
  expect(removeSpaces(output)).to.equal(removeSpaces(expected));
  if (unlink) await fileStream.unlink(testsFiles.output);
}

/**
 * Function that executes the run function and checks the output result
 * removing spaces and requires. It use mocking to check the console.log
 * @param {Object} testsFiles Object with the input, output, expectedjs and
 * correctout files
 * @param {boolean} verbose If true, it will show the console.log output
 */
async function checkRunConsoleLog(testsFiles, verbose = false) {
  let consoleOutput = "";
  const oldLog = console.log; // Mock console.log
  console.log = (output) => { consoleOutput += output; };
  let correctOut;

  // Transpile the input and recieve the output in the result variable
  try {
    const transpileResult = await transpile(testsFiles.input, { verbose: verbose });
    const evaluatedCode = await eval(transpileResult);
    correctOut = await fileStream.readFile(testsFiles.correctOut, 'utf-8');
    // If there is no print in the code, the last sentence is the result
    if (consoleOutput === "") consoleOutput = evaluatedCode.toString(); 
  } catch (error) {
    console.error(error);
  } finally {
    console.log = oldLog; // Restore console.log
  }
  
  expect(removeSpaces(consoleOutput)).to.equal(removeSpaces(correctOut));
}

async function checkRunConsoleError(testsFiles) {
  let consoleOutput = "";
  const originalConsoleError = console.error; // Mock console.error
  console.error = (message) => { consoleOutput += message; };
  const correctErr = await fileStream.readFile(testsFiles.correctErr, 'utf-8');

  try {
    await transpile(testsFiles.input);
    const output = await fileStream.readFile(testsFiles.output, 'utf-8');
    expect(removeSpaces(output)).to.equal(removeSpaces(correctErr));
  } catch (error) {
    await fileStream.writeFile(testsFiles.output, error.message);
    expect(removeSpaces(consoleOutput)).to.equal(removeSpaces(correctErr));
  } finally {
    console.error = originalConsoleError; // Restore console.error
  }
}

module.exports = { 
  removeSpaces, 
  checkTranspile, 
  checkRunConsoleLog, 
  checkRunConsoleError
};