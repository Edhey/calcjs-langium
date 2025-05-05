/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @desc Structure that implements the cache based on a Map.
 */

/**
 * Structure that implements the cache based on a Map.
 * It handles objects as keys in a map. Compares with the equals method if it 
 * exists, or with the default === operator.
 */
class StoreMap<K, V> {
  private store: Map<K, V>;

  constructor() {
    this.store = new Map<K, V>();
  }

  /**
   * Sets a value in the map for the given key.
   * If a key already exists (based on comparison), it updates the value.
   * @param key The key to set.
   * @param value The value to associate with the key.
   */
  set(key: K, value: V): void {
    for (const [storedKey] of this.store) {
      if (this._compareKeys(storedKey, key)) {
        this.store.set(storedKey, value);
        return;
      }
    }
    this.store.set(key, value);
  }

  /**
   * Gets the value associated with the given key.
   * @param key The key to retrieve the value for.
   * @returns The value associated with the key, or undefined if not found.
   */
  get(key: K): V | undefined {
    for (const [storedKey, storedValue] of this.store) {
      if (this._compareKeys(storedKey, key)) {
        return storedValue;
      }
    }
    return undefined;
  }

  /**
   * Checks if the map contains the given key.
   * @param key The key to check for.
   * @returns True if the key exists, false otherwise.
   */
  has(key: K): boolean {
    for (const storedKey of this.store.keys()) {
      if (this._compareKeys(storedKey, key)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Deletes the value associated with the given key.
   * @param key The key to delete.
   * @returns True if the key was deleted, false otherwise.
   */
  delete(key: K): boolean {
    for (const storedKey of this.store.keys()) {
      if (this._compareKeys(storedKey, key)) {
        this.store.delete(storedKey);
        return true;
      }
    }
    return false;
  }

  /**
   * Compares two keys for equality.
   * If the key has an `equals` method, it uses that for comparison.
   * Otherwise, it uses the strict equality operator (===).
   * @param key1 The first key to compare.
   * @param key2 The second key to compare.
   * @returns True if the keys are equal, false otherwise.
   */
  private _compareKeys(key1: K, key2: K): boolean {
    if (typeof (key1 as any).equals === 'function') {
      return (key1 as any).equals(key2);
    }
    return key1 === key2;
  }
}

export { StoreMap };