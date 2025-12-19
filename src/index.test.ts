import { describe, expect, it } from 'vitest';

import { deepEqual } from '.';

describe('deepEqual', () => {
  it('should compare primitives correctly', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('hello', 'hello')).toBe(true);
    expect(deepEqual('hello', 'world')).toBe(false);
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(true, false)).toBe(false);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(0, false, { strict: false })).toBe(true);
    expect(deepEqual(1, true, { strict: false })).toBe(true);
    expect(deepEqual('', false, { strict: false })).toBe(true);
    expect(deepEqual(0, false, { strict: true })).toBe(false);
  });

  it('should compare plain objects correctly', () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: {} })).toBe(false);
    expect(deepEqual({ a: 1, b: undefined }, { a: 1 })).toBe(false); // different keys
    expect(deepEqual({ a: 1, b: undefined }, { a: 1, b: undefined })).toBe(true);
  });

  it('should compare arrays correctly', () => {
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
    expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false);
  });

  it('should compare mixed types correctly', () => {
    expect(deepEqual({ a: 1 }, [1])).toBe(false);
    expect(deepEqual([1], { '0': 1 })).toBe(false);
    expect(deepEqual(1, '1')).toBe(false);
    expect(deepEqual(1, '1', { strict: false })).toBe(true);
  });

  it('should compare Dates correctly', () => {
    const date1 = new Date('2023-01-01T10:00:00.000Z');
    const date2 = new Date('2023-01-01T10:00:00.000Z');
    const date3 = new Date('2023-01-01T11:00:00.000Z');

    expect(deepEqual(date1, date2)).toBe(true);
    expect(deepEqual(date1, date3)).toBe(false);
    expect(deepEqual(date1, '2023-01-01')).toBe(false);
  });

  it('should compare RegExps correctly', () => {
    expect(deepEqual(/abc/g, /abc/g)).toBe(true);
    expect(deepEqual(/abc/g, /def/g)).toBe(false);
    expect(deepEqual(/abc/g, /abc/i)).toBe(false);
    expect(deepEqual(/abc/g, '/abc/g')).toBe(false);
  });

  it('should ignore specified keys when comparing objects', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 99, c: 3 };
    const obj3 = { a: 1, c: 3, d: 4 };

    expect(deepEqual(obj1, obj2, { ignoreKeys: ['b'] })).toBe(true);
    expect(deepEqual(obj1, obj3, { ignoreKeys: ['b', 'd'] })).toBe(true);
    expect(deepEqual(obj1, obj3, { ignoreKeys: ['b'] })).toBe(false); // d is not ignored
    expect(
      deepEqual({ a: 1, b: { c: 2, d: 3 } }, { a: 1, b: { c: 2, d: 99 } }, { ignoreKeys: ['d'] })
    ).toBe(true); // ignoreKeys only works at top level
    expect(
      deepEqual({ a: 1, b: { c: 2, d: 3 } }, { a: 1, b: { c: 2, d: 99 } }, { ignoreKeys: ['b.d'] })
    ).toBe(false); // ignoreKeys only works at top level
  });

  it('should compare complex nested structures', () => {
    const complex1 = {
      a: 1,
      b: [2, { c: 3, d: [4, new Date('2023')], e: /f/i }],
      g: null,
      h: undefined,
    };
    const complex2 = {
      a: 1,
      b: [2, { c: 3, d: [4, new Date('2023')], e: /f/i }],
      g: null,
      h: undefined,
    };
    const complex3 = {
      a: 1,
      b: [2, { c: 3, d: [4, new Date('2024')], e: /f/i }], // Date differs
      g: null,
      h: undefined,
    };
    const complex4 = {
      a: 1,
      b: [2, { c: 3, d: [4, new Date('2023')], e: /z/i }], // RegExp differs
      g: null,
      h: undefined,
    };

    expect(deepEqual(complex1, complex2)).toBe(true);
    expect(deepEqual(complex1, complex3)).toBe(false);
    expect(deepEqual(complex1, complex4)).toBe(false);
  });

  it('should handle circular references correctly', () => {
    const objA: any = {};
    const objB: any = {};
    objA.b = objB;
    objB.a = objA;

    const objC: any = {};
    const objD: any = {};
    objC.d = objD;
    objD.c = objC;

    const objE: any = { foo: 'bar' };
    objE.self = objE;

    const objF: any = { foo: 'bar' };
    objF.self = objF;

    const objG: any = { foo: 'baz' };
    objG.self = objG;

    expect(deepEqual(objA, objA)).toBe(true);
    expect(deepEqual(objA, objB)).toBe(false);
    expect(deepEqual(objC, objD.c)).toBe(true);
    expect(deepEqual(objA, objC)).toBe(false);
    expect(deepEqual(objE, objF)).toBe(true);
    expect(deepEqual(objE, objG)).toBe(false);

    const arr1: any = [];
    const arr2: any = [];
    arr1.push(arr1);
    arr2.push(arr2);

    const arr3: any = [];
    arr3.push(arr1);

    expect(deepEqual(arr1, arr2)).toBe(true);
    expect(deepEqual(arr1, arr3)).toBe(true);

    const mixed1: any = {};
    const mixed2: any = {};
    mixed1.arr = [mixed1];
    mixed2.arr = [mixed2];
    expect(deepEqual(mixed1, mixed2)).toBe(true);

    const mixed3: any = {};
    const mixed4: any = {};
    mixed3.obj = mixed3;
    mixed4.obj = mixed4;
    mixed3.prop = 1;
    mixed4.prop = 2;
    expect(deepEqual(mixed3, mixed4)).toBe(false);

    // Test deep circular structure equality
    const user1: any = {
      id: 1,
      name: 'Alice',
    };
    const post1: any = {
      title: 'Post 1',
      author: user1,
    };
    user1.posts = [post1];

    const user2: any = {
      id: 1,
      name: 'Alice',
    };
    const post2: any = {
      title: 'Post 1',
      author: user2,
    };
    user2.posts = [post2];

    expect(deepEqual(user1, user2)).toBe(true);

    const user3: any = {
      id: 1,
      name: 'Bob',
    };
    const post3: any = {
      title: 'Post 1',
      author: user3,
    };
    user3.posts = [post3];

    expect(deepEqual(user1, user3)).toBe(false);
  });

  it('should compare objects with symbol keys', () => {
    const sym1 = Symbol('foo');
    const sym2 = Symbol('bar');
    const obj1 = { a: 1, [sym1]: 'test' };
    const obj2 = { a: 1, [sym1]: 'test' };
    const obj3 = { a: 1, [sym1]: 'different' };
    const obj4 = { a: 1, [sym2]: 'test' };

    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
    expect(deepEqual(obj1, obj4)).toBe(false);

    const obj5 = { a: 1, [sym1]: 'test', b: 2 };
    const obj6 = { a: 1, [sym1]: 'test' };
    expect(deepEqual(obj5, obj6)).toBe(false);
  });

  it('should ignore symbol keys if specified (by string conversion)', () => {
    const sym1 = Symbol('foo');
    const obj1 = { a: 1, [sym1]: 'test' };
    const obj2 = { a: 1, [sym1]: 'different' };
    // Note: ignoreKeys is string[], so we compare symbol.toString()
    expect(deepEqual(obj1, obj2, { ignoreKeys: [sym1.toString()] })).toBe(true);
  });

  it('should handle different object prototypes', () => {
    class MyClass {
      constructor(public value: number) {}
    }
    const obj1 = { a: new MyClass(1) };
    const obj2 = { a: new MyClass(1) };
    const obj3 = { a: { value: 1 } };

    // Our current deepEqual treats class instances as plain objects if they don't have specific comparison methods.
    // It will compare their enumerable properties.
    expect(deepEqual(obj1, obj2)).toBe(true); // { value: 1 } vs { value: 1 }
    expect(deepEqual(obj1, obj3)).toBe(true); // { value: 1 } vs { value: 1 }
  });
});
