/**
 * Options for the `deepEqual` function.
 */
export interface DeepEqualOptions {
  /**
   * If `true`, strict equality (===) is used for primitive comparisons.
   * If `false`, loose equality (==) is used. Defaults to `true`.
   */
  strict?: boolean;
  /**
   * An array of keys to ignore during the comparison. These keys and their corresponding values
   * will not be considered when determining equality.
   */
  ignoreKeys?: string[];
}
