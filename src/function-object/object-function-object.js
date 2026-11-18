/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Thu 27 Mar 2025
 * @desc This file defines the ObjectFunctionObject class, which is a subclass 
 * of the FunctionObject class.
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

import { FunctionObject } from './function-object.js';

class ObjectFunctionObject extends FunctionObject {
  constructor(object) {
    const objectInitialFunction = () => undefined;
    super(objectInitialFunction);
    this.object = object;
    for (const key in object) {
      this.assign([key], object[key]);
    }
  }

  toString() {
    return JSON.stringify(this.object);
  }
}

function objectFunctionObject(object) {
  return new ObjectFunctionObject(object);
}

export { ObjectFunctionObject, objectFunctionObject };