/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * Práctica 3 - Hello Compilers
 *
 * @author Himar Edhey Hernández Alonso
 * @since Thu 27 Mar 2025
 * @desc Structure that implements the cache based on a Map.
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

/**
 * Structure that implements the cache based on a Map.
 * It handles objects as keys in a map. Compares with the equals method if it 
 * exist, or with the default === operator.
 */
class StoreMap {
  constructor() {
    this.store = new Map();
  }

  set(key, value) {
    for (let [storedKey, storedValue] of this.store) {
      if (this._compareKeys(storedKey, key)) {
        this.store.set(storedKey, value);
        return;
      }
    }
    this.store.set(key, value);
  }

  get(key) {
    for (let [storedKey, storedValue] of this.store) {
      if (this._compareKeys(storedKey, key)) {
        return storedValue;
      }
    }
    return undefined;
  }


  has(key) {
    for (let storedKey of this.store.keys()) {
      if (this._compareKeys(storedKey, key)) {
        return true;
      }
    }
    return false;
  }


  delete(key) {
    for (let storedKey of this.store.keys()) {
      if (this._compareKeys(storedKey, key)) {
        this.store.delete(storedKey);
        return true;
      }
    }
    return false;
  }

  _compareKeys(key1, key2) {
    if (key1.equals && key1.equals(key2)) {
      return true;
    }
    return key1 === key2;
  }
}

module.exports = { StoreMap };
