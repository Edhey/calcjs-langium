/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @autor Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Este archivo contiene los tests de la support library
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

import { expect } from 'chai';
import { gamma, Complex, print, min, max } from '../src/support-lib.js';

/**
 * @desc Tests for the support library
 */
describe('Support Library Tests', () => {
  it('should calculate the gamma function for a complex number', () => {
    const complexNumber = Complex('2+3i');
    const result = gamma(complexNumber);
    expect(result.re).to.be.a('number');
    expect(result.im).to.be.a('number');
  });

  it('should print a complex number', () => {
    const complexNumber = Complex('2+3i');
    const originalConsoleLog = console.log;
    let consoleOutput = '';
    console.log = function (...output) { consoleOutput += output.join(''); };
    print(complexNumber);
    expect(consoleOutput).to.equal('2 + 3i');
    console.log = originalConsoleLog;
  });

  it('should return the minimum of two complex numbers', () => {
    const complexNumber1 = Complex('1+2i');
    const complexNumber2 = Complex('3+4i');
    const result = min(complexNumber1, complexNumber2);
    expect(result.toString()).to.equal('1 + 2i');
  });

  it('should return the maximum of two complex numbers', () => {
    const complexNumber1 = Complex('1+2i');
    const complexNumber2 = Complex('3+4i');
    const result = max(complexNumber1, complexNumber2);
    expect(result.toString()).to.equal('3 + 4i');
  });

  it('should return the minimum of two complex numbers', () => {
    const complexNumber1 = Complex('3+2i');
    const complexNumber2 = Complex('3+4i');
    const result = min(complexNumber1, complexNumber2);
    expect(result.toString()).to.equal('3 + 2i');
  });

  it('should return the maximum of two complex numbers', () => {
    const complexNumber1 = Complex('1+2i');
    const complexNumber2 = Complex('1+4i');
    const result = max(complexNumber1, complexNumber2);
    expect(result.toString()).to.equal('1 + 4i');
  });
});