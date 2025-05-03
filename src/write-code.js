/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Procesadores de Lenguajes
 * Práctica 3 - Hello Compilers
 *
 * @author Himar Edhey Hernández Alonso
 * @since Sat 29 Feb 2025
 * @desc Write the output code to the output file
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

const fileStream = require('fs').promises;

/**
 * Write the output to the output file
 * @param {string} output - The output code
 * @param {Object} options - The options to transpile
 * @returns {string} - The output code
 */
async function writeCode(output, options) {
  if (options.verbose) console.log(output); // if verbose, print the output

  if (!options.output) 
    return output; // if there is no output file, return the output
  
  await fileStream.writeFile(options.output, output, 'utf-8'); // write the output to the output file

  return output;
}

module.exports = {
  writeCode
};