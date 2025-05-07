import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { CalcScriptLanguageMetaData } from '../language/generated/module.js';
import { createCalcScriptServices } from '../language/calc-script-module.js';
import { extractAstNode, extractDestinationAndName } from './cli-util.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as fspromise from 'node:fs/promises';
import * as path from 'node:path';
import pkg from 'template-file';
import { JavaScriptTranspiler } from '../code-generation/transpile.js';
import { exec } from 'node:child_process';
const { renderFile } = pkg;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fspromise.readFile(packagePath, 'utf-8');

export type GenerateOptions = {
  destination?: string,
  verbose?: boolean,
  ast?: boolean,
  scope?: boolean,
  definitions?: boolean,
  run?: boolean,
  return?: boolean,
  string?: boolean;
}

export default function (): void {
  const program = new Command();

  program.version(JSON.parse(packageContent).version);

  const fileExtensions = CalcScriptLanguageMetaData.fileExtensions.join(', ');
  program
    .name('calc2js')
    .showSuggestionAfterError()
    .argument('<file>', `CalcScript file to transpile (possible file extensions: ${fileExtensions})`)
    .option('-o, --output <filename>', 'Output JS file')
    .option('-v, --verbose', 'Show transpiled JS code')
    .option('-a, --ast', 'Show parsed AST')
    .option('-s, --scope', 'Show variable scope')
    .option('-D, --definitions', 'Show variable definitions')
    .option('-r, --run', 'Execute the resulting JS code')
    .description("Transpile an arithmetic expression into a JavaScript program")
    .action(async (fileName: string, options: GenerateOptions) => {
      const services = createCalcScriptServices(NodeFileSystem).CalcScript;
      const model = await extractAstNode<Model>(fileName, services);
      if (options.ast) {
        console.log(chalk.blue('Parsed AST:'));
        const jsonStr = services.serializer.JsonSerializer.serialize(model);
        const parsed = JSON.parse(jsonStr);
        const prettyJson = JSON.stringify(parsed, null, 2);
        console.log(prettyJson);
      }
      let code = JavaScriptTranspiler.transpile(model);
      const dependencies = Array.from(JavaScriptTranspiler.getDependencies());
      const root = __dirname.replace(/\/out.*$/, ''); // get the root path (Linux)
      if (dependencies.length > 0) {
        code = await renderFile(`${root}/src/code-generation/templates.txt`, { dependencies, root, code });
      }

      if (options.destination) {
        const data = extractDestinationAndName(fileName, options.destination);
        const generatedFilePath = `${path.join(data.destination, data.name)}.js`;
        if (!fs.existsSync(data.destination)) {
          fs.mkdirSync(data.destination, { recursive: true });
        }
        fs.writeFileSync(generatedFilePath, code);
        console.log(chalk.green(`JavaScript code written to ${generatedFilePath}`));
      }
      if (options.verbose) {
        // console.log(chalk.blue('Generated JavaScript code:'));
        console.log(code);
      }
      if (options.run || options.string || options.return) {
        const tempFile = path.join(__dirname, 'tempCode.js');
        await fs.writeFileSync(tempFile, code);
        await exec(`node ${tempFile}`, (error, stdout, stderr) => {
          if (error) {
            console.error(chalk.red(`Error: ${error.message}`));
            return;
          }
          if (stderr) {
            console.error(chalk.red(`stderr: ${stderr}`));
            return;
          }
          console.log(stdout.trim());
        });
      }
    });

  program.parse(process.argv);
}