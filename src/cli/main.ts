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
import * as os from 'node:os';
import * as crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { generateJavaScript } from '../code-generation/generate.js';
const execFileAsync = promisify(execFile);
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
      try {
        const services = createCalcScriptServices(NodeFileSystem).CalcScript;
        const model = await extractAstNode<Model>(fileName, services);
        if (options.ast) {
          console.log(chalk.blue('Parsed AST:'));
          const jsonStr = services.serializer.JsonSerializer.serialize(model);
          const parsed = JSON.parse(jsonStr);
          const prettyJson = JSON.stringify(parsed, null, 2);
          console.log(prettyJson);
        }
        const code = await generateJavaScript(model);

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
          console.log(code);
        }
        if (options.run || options.string || options.return) {
          const tempFile = path.join(
            os.tmpdir(),
            `calc2js-${process.pid}-${crypto.randomUUID()}.js`
          );
          await fspromise.writeFile(tempFile, code, 'utf-8');
          try {
            const { stdout, stderr } = await execFileAsync(process.execPath, [tempFile]);
            if (stderr) {
              console.error(chalk.red(`stderr: ${stderr}`));
            }
            if (stdout.trim()) {
              console.log(stdout.trim());
            }
          } catch (err) {
            const details = err && typeof err === 'object' && 'stderr' in err
              ? String((err as { stderr?: unknown }).stderr)
              : err instanceof Error ? err.message : String(err);
            const runtimeLine = details
              .split(/\r?\n/)
              .find(line => /\b(?:Error|TypeError|ReferenceError|RangeError):/.test(line));
            const message = runtimeLine?.replace(/^\w*Error:\s*/, '') ?? 'Generated JavaScript execution failed';
            console.error(chalk.red(`Runtime error: ${message}`));
            process.exitCode = 1;
          } finally {
            await fspromise.rm(tempFile, { force: true });
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(chalk.red(message));
        process.exitCode = 1;
      }
    });

  program.parse(process.argv);
}