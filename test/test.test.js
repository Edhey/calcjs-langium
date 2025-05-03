/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * Práctica 3 - Hello Compilers
 *
 * @autor Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Este archivo contiene los tests de la práctica
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

const TestExample = require('./test-example-description.js');
const TestBasic = require('./test-basic-description.js');
const TestSimple = require('./test-description.js');
const TestHard = require('./test-hard-description.js');
const TestErrorSyntax = require('./test-error-description.js');
const TestBasicErrorSyntax = require('./test-basic-error-description.js');

const { checkTranspile, checkRunConsoleLog, checkRunConsoleError } = require('./test-utils.js');

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


/**
 * Test data for the error syntax tests
 */
const ErrorSyntaxTest = TestErrorSyntax.map(testDescription => ({
  input: __dirname + '/errors/syntax-error/' + testDescription.input,
  output: __dirname + '/errors/output/' + testDescription.output,
  correctErr: __dirname + '/errors/correct-err/' + testDescription.correctErr,
}));

/**
 * Test data for the basic error syntax tests
 */
const BasicErrorTest = TestBasicErrorSyntax.map(testDescription => ({
  input: __dirname + '/basic-errors/basic-syntax-error/' + testDescription.input,
  output: __dirname + '/basic-errors/output/' + testDescription.output,
  correctErr: __dirname + '/basic-errors/correct-err/' + testDescription.correctErr,
}));

/**
 * Example Tests
 * Run the simple tests and check the output
 */
describe('Example Test', function () {
  /**
   * Transpile the simple tests and check the output
   */
  describe('Example Transpile Tests', function () {
    for (let i = 0; i < ExampleTest.length; i++) {
      it(`transpile(${ExampleTest[i].input}, ${ExampleTest[i].output})`, async function () {
        await checkTranspile(ExampleTest[i]);
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
        await checkRunConsoleLog(ExampleTest[i]);
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
        await checkTranspile(BasicTest[i]);
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
        await checkRunConsoleLog(BasicTest[i]);
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
        await checkTranspile(SimpleTest[i]);
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
        await checkTranspile(HardTest[i]);
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

/**
 * Syntax Error Tests
 * Run the simple tests and check the output
 */
describe('Syntax Error Tests', function () {
  for (let i = 0; i < ErrorSyntaxTest.length; i++) {
    it(`check syntax errors(${ErrorSyntaxTest[i].input}, ${ErrorSyntaxTest[i].output})`, async () => {
      await checkRunConsoleError(ErrorSyntaxTest[i]);
    });
  }
});

/**
 * Basic Syntax Error Tests
 * Run the simple tests and check the output
 */
describe('Basic Syntax Error Tests', function () {
  for (let i = 0; i < BasicErrorTest.length; i++) {
    it(`check syntax errors(${BasicErrorTest[i].input}, ${BasicErrorTest[i].output})`, async () => {
      await checkRunConsoleError(BasicErrorTest[i]);
    });
  }
});