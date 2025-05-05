// import { NodeFileSystem } from 'langium/node';
// import { createCalcScriptServices } from '../language/calc-script-module.js';
// // import { scopeAnalysis, findDependecies } from '../scope/scope-analisys.js';
// // import { codeGeneration } from './code-generation.js';
// // import { writeCode } from './write-code.js';

// import fs from 'fs/promises';
// import { GenerateOptions } from '../cli/main-original.js';
// import { Model } from '../language/generated/ast.js';

// export async function transpile(model: Model, inputFile: string, options: GenerateOptions): Promise<string> {
//   const services = createCalcScriptServices(NodeFileSystem).CalcScript;

//   let input: string;
//   try {
//     input = await fs.readFile(inputFile, 'utf-8');
//   } catch (error) {
//     console.error(`Can't read file "${inputFile}"`);
//     return error as string;
//   }

//   // Crear documento Langium y obtener AST
//   const document = services.shared.workspace.LangiumDocumentFactory.fromString(input, inputFile);
//   await services.shared.workspace.DocumentBuilder.build([document]);
//   let ast = extractAst(document);

//   ast = findDependecies(ast);
//   ast = scopeAnalysis(ast);

//   if (options.ast) {
//     console.log(JSON.stringify(ast, null, 2));
//   }

//   if (options.definitions) {
//     console.log("Definitions:");
//     for (const [key, value] of ast.scope.definitions) {
//       console.log(key + " -> " + JSON.stringify(value, null, 2));
//     }
//   }

//   if (options.scope) {
//     console.log("Scope:");
//     for (const [key, value] of ast.scope.scope) {
//       console.log(key + " -> " + JSON.stringify(value, null, 2));
//     }
//   }

//   const output = await codeGeneration(ast);
//   await writeCode(output, options);
//   return output;
// }
