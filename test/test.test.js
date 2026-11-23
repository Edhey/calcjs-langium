/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @autor Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Este archivo contiene los tests de la práctica
 * @see {@link https://github.com/Edhey/calcjs-langium}
 */

import { TestExample } from './test-example-description.mjs';
import { TestBasic } from './test-basic-description.mjs';
import { TestSimple } from './test-description.mjs';
import { TestHard } from './test-hard-description.mjs';
import { checkRunConsoleError, checkRunConsoleLog, checkTranspile, removeSpaces } from './test-utils.ts';
import * as fileStream from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { expect } from 'chai';
import { readdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliPath = path.resolve(__dirname, '../bin/cli');

/**
 * Test data for the examples
 */
const ExampleTest = TestExample.map(testDescription => ({
  input: __dirname + '/examples-data/input/' + testDescription.input,
  output: __dirname + '/examples-data/output/' + testDescription.output,
  expected: __dirname + '/examples-data/expected-js/' + testDescription.expected,
  correctOut: __dirname + '/examples-data/correct-out/' + testDescription.correctOut,
}));

/**
 * Test data for the basic tests
 */
const BasicTest = TestBasic.map(testDescription => ({
  input: __dirname + '/basic/input/' + testDescription.input,
  output: __dirname + '/basic/output/' + testDescription.output,
  expected: __dirname + '/basic/expected-js/' + testDescription.expected,
  correctOut: __dirname + '/basic/correct-out/' + testDescription.correctOut,
}));

/**
 * Test data for the simple tests
 */
const SimpleTest = TestSimple.map(testDescription => ({
  input: __dirname + '/data/input/' + testDescription.input,
  output: __dirname + '/data/output/' + testDescription.output,
  expected: __dirname + '/data/expected-js/' + testDescription.expected,
  correctOut: __dirname + '/data/correct-out/' + testDescription.correctOut,
}));

/**
 * Test data for the hard tests
 */
const HardTest = TestHard.map(testDescription => ({
  input: __dirname + '/hard/input/' + testDescription.input,
  output: __dirname + '/hard/output/' + testDescription.output,
  expected: __dirname + '/hard/expected-js/' + testDescription.expected,
  correctOut: __dirname + '/hard/correct-out/' + testDescription.correctOut,
}));


const errorCategories = ['syntax-errors', 'semantic-errors', 'runtime-errors'];
const ErrorTests = Object.fromEntries(errorCategories.map(category => [
  category,
  readdirSync(path.join(__dirname, 'errors', category))
    .filter(file => file.endsWith('.calc'))
    .map(file => ({ input: path.join(__dirname, 'errors', category, file) }))
]));

const parserDiagnostic = /Expecting|unexpected|token/i;

function assertErrorResult(result, phase) {
  const reported = `${result.stderr}\n${result.error?.message ?? ''}`.trim();
  expect(result.code).to.equal(1);
  expect(reported).to.not.equal('');
  expect(reported).not.to.match(/Cannot read properties of undefined|reading 'ast'|reading 'forEach'/);

  if (phase === 'syntax-errors') {
    expect(reported).to.match(parserDiagnostic);
  } else if (phase === 'semantic-errors') {
    expect(reported).to.match(/Syntax\/validation error/);
    expect(reported).not.to.match(parserDiagnostic);
  } else {
    expect(reported).to.match(/Runtime error/);
  }
}

/**
 * Example Tests
 * Run the simple tests and check the output
 */
describe('Example Test', function () {
  this.timeout(5000);
  /**
   * Transpile the simple tests and check the output
   */
  describe('Example Transpile Tests', function () {
    for (let i = 0; i < ExampleTest.length; i++) {
      it(`transpile(${ExampleTest[i].input}, ${ExampleTest[i].output})`, async function () {
        const result = await checkTranspile(ExampleTest[i]);
        if (result.code !== 0) {
          console.log('Error code:', result.code);
          console.log('Error message:', result.error);
        }
        await fileStream.writeFile(ExampleTest[i].output, result.stdout);
        const expected = await fileStream.readFile(ExampleTest[i].expected, 'utf-8');
        const cleanStdout = removeSpaces(result.stdout);
        const cleanExpected = removeSpaces(expected);
        expect(cleanStdout).to.equal(cleanExpected);
      });
    }
  });

  /**
   * Run the examples tests and check the output
   * Using mocking to check the output
   */
  describe('Example Run Tests', function () {
    for (let i = 0; i < ExampleTest.length; i++) {
      it(`run function with ${ExampleTest[i].input}`, async function () {
        const result = await checkRunConsoleLog(ExampleTest[i]);
        if (result.code !== 0) {
          console.log('Error code:', result.code);
          console.log('Error message:', result.error);
        }
        await fileStream.writeFile(ExampleTest[i].output, result.stdout);
        const expected = await fileStream.readFile(ExampleTest[i].correctOut, 'utf-8');
        const cleanStdout = removeSpaces(result.stdout);
        const cleanExpected = removeSpaces(expected);
        expect(cleanStdout).to.equal(cleanExpected);
      });
    }
  });
});

describe('Basic Tests', function () {
  /**
   * Transpile the simple tests and check the output
   */
  describe('Basic Transpile Tests', function () {
    for (let i = 0; i < BasicTest.length; i++) {
      it(`transpile(${BasicTest[i].input}, ${BasicTest[i].output})`, async function () {
        const result = await checkTranspile(BasicTest[i]);
        if (result.code !== 0) {
          console.log('Error code:', result.code);
          console.log('Error message:', result.error);
        }
        await fileStream.writeFile(BasicTest[i].output, result.stdout);
        const expected = await fileStream.readFile(BasicTest[i].expected, 'utf-8');
        const cleanStdout = removeSpaces(result.stdout);
        const cleanExpected = removeSpaces(expected);
        expect(cleanStdout).to.equal(cleanExpected);
      });
    }
  });

  /**
   * Run the simple tests and check the output
   * Using mocking to check the output
   */
  describe('Basic Run Tests', function () {
    for (let i = 0; i < BasicTest.length; i++) {
      it(`run function with ${BasicTest[i].input}`, async function () {
        const result = await checkRunConsoleLog(BasicTest[i]);
        if (result.code !== 0) {
          console.log('Error code:', result.code);
          console.log('Error message:', result.error);
        }
        await fileStream.writeFile(BasicTest[i].output, result.stdout);
        const expected = await fileStream.readFile(BasicTest[i].correctOut, 'utf-8');
        const cleanStdout = removeSpaces(result.stdout);
        const cleanExpected = removeSpaces(expected);
        expect(cleanStdout).to.equal(cleanExpected);
      });
    }
  });
});

/**
 * Simple Tests
 * Run the example tests and check the output
 */
describe('Simple Test', function () {
  /**
   * Transpile the example tests and check the output
   */
  describe('Simple Transpile Tests', function () {
    for (let i = 0; i < SimpleTest.length; i++) {
      it(`transpile(${SimpleTest[i].input}, ${SimpleTest[i].output})`, async function () {
        const result = await checkTranspile(SimpleTest[i]);
        if (result.code !== 0) {
          console.log('Error code:', result.code);
          console.log('Error message:', result.error);
        }
        await fileStream.writeFile(SimpleTest[i].output, result.stdout);
        const expected = await fileStream.readFile(SimpleTest[i].expected, 'utf-8');
        const cleanStdout = removeSpaces(result.stdout);
        const cleanExpected = removeSpaces(expected);
        expect(cleanStdout).to.equal(cleanExpected);
      });
    }
  });

  /**
   * Run the simple tests and check the output
   * Using mocking to check the output
   */
  describe('Simple Run Tests', function () {
    for (let i = 0; i < SimpleTest.length; i++) {
      it(`run function with ${SimpleTest[i].input}`, async function () {
        await checkRunConsoleLog(SimpleTest[i]);
      });
    }
  });
});

/**
 * Hard Tests
 * Run the hard tests and check the output
 */
describe('Hard Tests', function () {
  /**
   * Transpile the hard tests and check the output
   */
  describe('Transpile Tests', function () {
    for (let i = 0; i < HardTest.length; i++) {
      it(`transpile(${HardTest[i].input}, ${HardTest[i].output})`, async function () {
        const result = await checkTranspile(HardTest[i]);
        if (result.code !== 0) {
          console.log('Error code:', result.code);
          console.log('Error message:', result.error);
        }
        await fileStream.writeFile(HardTest[i].output, result.stdout);
        const expected = await fileStream.readFile(HardTest[i].expected, 'utf-8');
        const cleanStdout = removeSpaces(result.stdout);
        const cleanExpected = removeSpaces(expected);
        expect(cleanStdout).to.equal(cleanExpected);
      });
    }
  });

  /**
   * Run the hard tests and check the output
   * Using mocking to check the output
   */
  describe('Hard Run Tests', function () {
    for (let i = 0; i < HardTest.length; i++) {
      it(`run function with ${HardTest[i].input}`, async function () {
        await checkRunConsoleLog(HardTest[i]);
      });
    }
  });
});

for (const category of errorCategories) {
  describe(`${category[0].toUpperCase()}${category.slice(1)}`, function () {
    for (const testCase of ErrorTests[category]) {
      it(`reports ${path.basename(testCase.input)}`, async () => {
        const result = await checkRunConsoleError(testCase);
        assertErrorResult(result, category);
      });
    }
  });
}