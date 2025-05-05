import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { CalcScriptLanguageMetaData } from '../language/generated/module.js';
import { createCalcScriptServices } from '../language/calc-script-module.js';
import { extractAstNode, extractDestinationAndName } from './cli-util.js';
import { generateJavaScript } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as fspromise from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fspromise.readFile(packagePath, 'utf-8');

export const transpileJSAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
  const services = createCalcScriptServices(NodeFileSystem).CalcScript;
  const model = await extractAstNode<Model>(fileName, services);
  const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
  console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

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
    .option('-re, --return', 'Print return value of last expression')
    .option('-S, --string', 'Print return value as string')
    .description("Transpile an arithmetic expression into a JavaScript program")
    .action(async (fileName: string, options: GenerateOptions) => {
      const services = createCalcScriptServices(NodeFileSystem).CalcScript;
      const model = await extractAstNode<Model>(fileName, services);
      const jsCode = generateJavaScript(model, fileName, options.destination);
      if (options.destination) {
        const data = extractDestinationAndName(fileName, options.destination);
        const generatedFilePath = `${path.join(data.destination, data.name)}.js`;
        if (!fs.existsSync(data.destination)) {
          fs.mkdirSync(data.destination, { recursive: true });
        }
        fs.writeFileSync(generatedFilePath, jsCode);
      }
      if (options.verbose) {
        console.log(chalk.blue('Generated JavaScript code:'));
        console.log(jsCode);
      }
      if (options.ast) {
        console.log(chalk.blue('Parsed AST:'));
        const jsonStr = services.serializer.JsonSerializer.serialize(model);
        const parsed = JSON.parse(jsonStr);
        const prettyJson = JSON.stringify(parsed, null, 2);
        console.log(prettyJson);
      }
    });

  program.parse(process.argv);
}
