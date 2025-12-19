import { isObject } from '@se-oss/object';

import type { DeepEqualOptions } from './typings';

/**
 * Performs a deep comparison between two values to determine if they are equivalent.
 *
 * This function supports comparing primitives, objects, arrays, Dates, and RegExps.
 * It can optionally perform strict or loose equality checks for primitives and ignore specified keys.
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @param options Optional configuration for the deep comparison.
 * @returns `true` if the two values are deeply equal, `false` otherwise.
 *
 * @example
 * deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
 * deepEqual([1, { a: 2 }], [1, { a: 2 }]); // true
 * deepEqual(new Date('2023-01-01'), new Date('2023-01-01')); // true
 * deepEqual({ a: 1, b: 2 }, { a: 1, b: '2' }, { strict: false }); // true (due to loose equality)
 * deepEqual({ a: 1, b: 2 }, { a: 1, c: 2 }, { ignoreKeys: ['b', 'c'] }); // true
 */
export function deepEqual(a: any, b: any, options?: DeepEqualOptions): boolean {
  const { strict = true, ignoreKeys = [] } = options || {};
  const ignoreKeySet = new Set(ignoreKeys);

  const seen = new WeakMap<object, WeakMap<object, true>>();

  function mark(x: object, y: object): boolean {
    let m = seen.get(x);
    if (m) {
      if (m.has(y)) return true;
    } else {
      m = new WeakMap();
      seen.set(x, m);
    }
    m.set(y, true);
    return false;
  }

  function compare(x: any, y: any): boolean {
    if (x === y) return true;

    if (!strict && !isObject(x) && !isObject(y)) return x == y;
    if (typeof x !== typeof y) return false;
    if (!isObject(x) || !isObject(y)) return false;

    if (mark(x as object, y as object)) return true;

    if (x instanceof Date && y instanceof Date) return x.getTime() === y.getTime();
    if (x instanceof RegExp && y instanceof RegExp)
      return x.source === y.source && x.flags === y.flags;

    if (Array.isArray(x)) {
      if (!Array.isArray(y)) return false;
      const xa = x as unknown[];
      const ya = y as unknown[];
      if (xa.length !== ya.length) return false;
      for (let i = 0; i < xa.length; i++) {
        if (!compare(xa[i], ya[i])) return false;
      }
      return true;
    }

    const xo = x as Record<PropertyKey, unknown>;
    const yo = y as Record<PropertyKey, unknown>;

    let countX = 0;

    for (const k in xo) {
      if (!Object.prototype.hasOwnProperty.call(xo, k)) continue;
      if (ignoreKeySet.has(k)) continue;
      countX++;
      if (!Object.prototype.hasOwnProperty.call(yo, k)) return false;
      if (!compare(xo[k], yo[k])) return false;
    }

    const xs = Object.getOwnPropertySymbols(xo);
    for (let i = 0; i < xs.length; i++) {
      const s = xs[i];
      if (ignoreKeySet.has(s.toString())) continue;
      countX++;
      if (!Object.prototype.hasOwnProperty.call(yo, s)) return false;
      if (!compare(xo[s], yo[s])) return false;
    }

    let countY = 0;
    for (const k in yo) {
      if (!Object.prototype.hasOwnProperty.call(yo, k)) continue;
      if (!ignoreKeySet.has(k)) countY++;
    }
    const ys = Object.getOwnPropertySymbols(yo);
    for (let i = 0; i < ys.length; i++) {
      if (!ignoreKeySet.has(ys[i].toString())) countY++;
    }

    return countX === countY;
  }

  return compare(a, b);
}

export { deepEqual as default };
export type * from './typings';
