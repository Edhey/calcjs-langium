/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @desc This file defines the ObjectFunctionObject class, which is a subclass 
 * of the FunctionObject class.
 */

import { FunctionObject } from './function-object.js';

class ObjectFunctionObject<T extends Record<string, any>> extends FunctionObject {
  private object: T;

  constructor(object: T) {
    const objectInitialFunction = () => undefined;
    super(objectInitialFunction);
    this.object = object;
    for (const key in object) {
      this.assign([key], object[key]);
    }
  }

  /**
   * Converts the object to a JSON string representation.
   * @returns The JSON string representation of the object.
   */
  override toString(): string {
    return JSON.stringify(this.object);
  }
}

/**
 * Factory function to create an ObjectFunctionObject instance.
 * @param object The object to wrap.
 * @returns An instance of ObjectFunctionObject.
 */
function objectFunctionObject<T extends Record<string, any>>(object: T): ObjectFunctionObject<T> {
  return new ObjectFunctionObject(object);
}

export { ObjectFunctionObject, objectFunctionObject };