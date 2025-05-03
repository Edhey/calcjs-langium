import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { CalcScriptLanguageMetaData } from '../language/generated/module.js';
import { createCalcScriptServices } from '../language/calc-script-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createCalcScriptServices(NodeFileSystem).CalcScript;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
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
        .action(generateAction);

    program.parse(process.argv);
}
