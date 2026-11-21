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
 * @see {@link https://github.com/Edhey/calcjs-langium}
 */

import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import chalk from 'chalk';
import { URI } from 'langium';
import { NodeFileSystem } from 'langium/node';
import { createCalcScriptServices } from '../out/language/calc-script-module.js';
import type { Model } from '../src/language/generated/ast.js';
import { generateJavaScript } from '../out/code-generation/generate.js';

const calcScriptServices = createCalcScriptServices(NodeFileSystem).CalcScript;

interface CliResult {
  code: number,
  error: Error | null,
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

async function getModel(fileName: string): Promise<Model | undefined> {
  if (!fs.existsSync(fileName)) {
    console.error(chalk.red(`File ${fileName} does not exist.`));
    return undefined;
  }

  const document = await calcScriptServices.shared.workspace.LangiumDocuments
    .getOrCreateDocument(URI.file(path.resolve(fileName)));
  await calcScriptServices.shared.workspace.DocumentBuilder.build([document], { validation: true });

  const parseErrors = document.parseResult?.parserErrors ?? [];
  const validationErrors = (document.diagnostics ?? []).filter(diagnostic => diagnostic.severity === 1);
  if (parseErrors.length > 0 || validationErrors.length > 0) {
    console.error(chalk.red('There are validation errors:'));
    for (const parseError of parseErrors) {
      console.error(chalk.red(parseError.message));
    }
    for (const validationError of validationErrors) {
      console.error(chalk.red(
        `line ${validationError.range.start.line + 1}: ${validationError.message} [${document.textDocument.getText(validationError.range)}]`
      ));
    }
    return undefined;
  }

  return document.parseResult?.value as Model | undefined;
}

async function transpileInProcess(fileName: string, returnLast = false): Promise<string> {
  const model = await getModel(fileName);
  if (!model) {
    return '';
  }
  return generateJavaScript(model, returnLast);
}

async function executeCaptured(fileName: string): Promise<CliResult> {
  const originalLog = console.log;
  const originalError = console.error;
  let stdout = '';
  let stderr = '';
  let tmpFile: string | undefined;

  console.log = (...values: unknown[]) => {
    stdout += `${values.join(' ')}\n`;
  };
  console.error = (...values: unknown[]) => {
    stderr += `${values.join(' ')}\n`;
  };

  try {
    const code = await transpileInProcess(fileName, true);
    if (!code) {
      return { code: 1, error: new Error('CalcScript validation failed'), stdout, stderr };
    }

    tmpFile = path.join(os.tmpdir(), `calcjs-${process.pid}-${randomUUID()}.mjs`);
    await fsPromises.writeFile(tmpFile, code, 'utf8');
    const mod = await import(`${pathToFileURL(tmpFile).href}?t=${Date.now()}-${randomUUID()}`) as {
      __lastValue?: unknown;
    };
    if (stdout.trim() === '' && mod.__lastValue !== undefined && mod.__lastValue !== null) {
      stdout = String(mod.__lastValue);
    }
    return { code: 0, error: null, stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    const executionError = error instanceof Error ? error : new Error(String(error));
    return { code: 1, error: executionError, stdout: stdout.trim(), stderr: stderr.trim() };
  } finally {
    console.log = originalLog;
    console.error = originalError;
    if (tmpFile) {
      await fsPromises.rm(tmpFile, { force: true });
    }
  }
}

/**
 * Function that executes the transpile function and checks the output result
 * removing spaces and requires
 * @param testsFiles Object with the input, output, expectedjs and correctout files
 * @param unlink If true, it will delete the output file after checking
 */
export async function checkTranspile(testsFiles: TestFiles): Promise<CliResult> {
  try {
    const stdout = await transpileInProcess(testsFiles.input);
    return { code: stdout ? 0 : 1, error: stdout ? null : new Error('CalcScript validation failed'), stdout, stderr: '' };
  } catch (error) {
    return {
      code: 1,
      error: error instanceof Error ? error : new Error(String(error)),
      stdout: '',
      stderr: ''
    };
  }
}

/**
 * Function that executes the run function and checks the output result
 * removing spaces and requires. It uses mocking to check the console.log
 * @param testsFiles Object with the input, output, expectedjs and correctout files
 * @param verbose If true, it will show the console.log output
 */
export async function checkRunConsoleLog(testsFiles: TestFiles): Promise<CliResult> {
  return executeCaptured(testsFiles.input);
}

/**
 * Function that executes the run function and checks the error output
 * @param testsFiles Object with the input, output, expectedjs and correcterr files
 */
export async function checkRunConsoleError(testsFiles: TestFiles): Promise<CliResult> {
  return executeCaptured(testsFiles.input);
}