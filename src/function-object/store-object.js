/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @author Himar Edhey Hernández Alonso
 * @since Sat 29 Mar 2025
 * @desc Structure that implements the cache based on an Object.
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

/**
 * Structure that implements the cache based on an Object.create(null)
 */
class StoreObject {
  constructor() {
    this.store = Object.create(null);
  }

  set(key, value) {
    this.store[this._getKeyString(key)] = { key, value };
  }

  get(key) {
    return this.store[this._getKeyString(key)]?.value;
  }

  has(key) {
    return this._getKeyString(key) in this.store;
  }

  delete(key) {
    const keyString = this._getKeyString(key);
    if (keyString in this.store) {
      delete this.store[keyString];
      return true;
    }
    return false;
  }

  _getKeyString(key) {
    return key && key.toString ? key.toString() : String(key);
  }
}

export { StoreObject };
