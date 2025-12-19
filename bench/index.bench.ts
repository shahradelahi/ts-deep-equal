import { deepEqual } from '@se-oss/deep-equal';
import deepequal from 'deep-equal';
import _ from 'lodash';
import { bench, describe } from 'vitest';

// Sample objects for benchmarking
const obj1 = {
  a: 1,
  b: 'hello',
  c: true,
  d: null,
  e: undefined,
  f: [1, 2, { g: 3, h: [new Date('2023-01-01'), /test/i] }],
  i: { j: 4, k: { l: 'world' } },
  m: new Date('2024-01-01T00:00:00.000Z'),
  n: /pattern/g,
};

const obj2 = { ...obj1 }; // Deeply equal copy

const obj3 = {
  // Unequal copy
  a: 1,
  b: 'hello',
  c: true,
  d: null,
  e: undefined,
  f: [1, 2, { g: 3, h: [new Date('2023-01-01'), /test/i] }],
  i: { j: 4, k: { l: 'different' } }, // This will make it unequal
  m: new Date('2024-01-01T00:00:00.000Z'),
  n: /pattern/g,
};

const circular1: any = {};
circular1.a = circular1;
const circular2: any = {};
circular2.a = circular2;

const circular3: any = {};
circular3.b = circular1; // This will be different if not handled as deep-equal

const circular4: any = { prop: 1 };
circular4.self = circular4;
const circular5: any = { prop: 1 };
circular5.self = circular5;
const circular6: any = { prop: 2 };
circular6.self = circular6;

describe('Deep Equal Benchmarks - Equal Objects', () => {
  bench('@se-oss/deep-equal', () => {
    deepEqual(obj1, obj2);
  });

  bench('deep-equal', () => {
    deepequal(obj1, obj2);
  });

  bench('lodash.isEqual', () => {
    _.isEqual(obj1, obj2);
  });
});

describe('Deep Equal Benchmarks - Unequal Objects', () => {
  bench('@se-oss/deep-equal', () => {
    deepEqual(obj1, obj3);
  });

  bench('deep-equal', () => {
    deepequal(obj1, obj3);
  });

  bench('lodash.isEqual', () => {
    _.isEqual(obj1, obj3);
  });
});

describe('Deep Equal Benchmarks - Circular References (Equal)', () => {
  bench('@se-oss/deep-equal', () => {
    deepEqual(circular4, circular5);
  });

  bench('deep-equal', () => {
    deepequal(circular4, circular5);
  });

  bench('lodash.isEqual', () => {
    _.isEqual(circular4, circular5);
  });
});

describe('Deep Equal Benchmarks - Circular References (Unequal)', () => {
  bench('@se-oss/deep-equal', () => {
    deepEqual(circular4, circular6);
  });

  bench('deep-equal', () => {
    deepequal(circular4, circular6);
  });

  bench('lodash.isEqual', () => {
    _.isEqual(circular4, circular6);
  });
});

describe('Deep Equal Benchmarks - Simple Circular References (Equal)', () => {
  bench('@se-oss/deep-equal', () => {
    deepEqual(circular1, circular2);
  });

  bench('deep-equal', () => {
    deepequal(circular1, circular2);
  });

  bench('lodash.isEqual', () => {
    _.isEqual(circular1, circular2);
  });
});
