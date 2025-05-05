// /**
//  * Universidad de La Laguna
//  * Escuela Superior de Ingeniería y Tecnología
//  * Grado en Ingeniería Informática
//  * Procesadores de Lenguajes
//  * TFA - Langium Syntaxis and Errors for Calculator
//  *
//  * @author Himar Edhey Hernández Alonso
//  * @since Sat 29 Feb 2025
//  * @desc Write the output code to the output file
//  * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
//  */

// import { promises as fileStream } from 'fs';
// import type { TranspileOptions } from './transpile.js';

// /**
//  * Write the output to the output file.
//  * @param output - The output code
//  * @param options - The options to transpile
//  * @returns The output code
//  */
// export async function writeCode(output: string, options: TranspileOptions): Promise<string> {
//   if (options.verbose) console.log(output);

//   if (!options.output) {
//     return output;
//   }

//   await fileStream.writeFile(options.output, output, 'utf-8');
//   return output;
// }
