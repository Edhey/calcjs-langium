/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * TFA - Langium Syntaxis and Errors for Calculator
 *
 * @desc Structure that implements the cache based on an Object.
 */

/**
 * Structure that implements the cache based on an Object.create(null)
 */
class StoreObject<K, V> {
  private store: Record<string, { key: K; value: V }>;

  constructor() {
    this.store = Object.create(null);
  }

  /**
   * Sets a value in the store for the given key.
   * @param key The key to set.
   * @param value The value to associate with the key.
   */
  set(key: K, value: V): void {
    this.store[this._getKeyString(key)] = { key, value };
  }

  /**
   * Gets the value associated with the given key.
   * @param key The key to retrieve the value for.
   * @returns The value associated with the key, or undefined if not found.
   */
  get(key: K): V | undefined {
    return this.store[this._getKeyString(key)]?.value;
  }

  /**
   * Checks if the store contains the given key.
   * @param key The key to check for.
   * @returns True if the key exists, false otherwise.
   */
  has(key: K): boolean {
    return this._getKeyString(key) in this.store;
  }

  /**
   * Deletes the value associated with the given key.
   * @param key The key to delete.
   * @returns True if the key was deleted, false otherwise.
   */
  delete(key: K): boolean {
    const keyString = this._getKeyString(key);
    if (keyString in this.store) {
      delete this.store[keyString];
      return true;
    }
    return false;
  }

  /**
   * Converts a key to a string representation.
   * If the key has a `toString` method, it uses that; otherwise, it uses `String(key)`.
   * @param key The key to convert.
   * @returns The string representation of the key.
   */
  private _getKeyString(key: K): string {
    return key && typeof key.toString === 'function' ? key.toString() : String(key);
  }
}

export { StoreObject };