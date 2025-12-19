# @se-oss/deep-equal

[![CI](https://github.com/shahradelahi/ts-deep-equal/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/shahradelahi/ts-deep-equal/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/deep-equal.svg)](https://www.npmjs.com/package/@se-oss/deep-equal)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@se-oss/deep-equal)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/deep-equal)](https://packagephobia.com/result?p=@se-oss/deep-equal)

_@se-oss/deep-equal_ is a performant, and reliable deep equality comparison utility for JavaScript and TypeScript.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install @se-oss/deep-equal
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install @se-oss/deep-equal
```

**yarn**

```bash
yarn add @se-oss/deep-equal
```

</details>

## 📖 Usage

```ts
import { deepEqual } from '@se-oss/deep-equal';

deepEqual(1, 1); // true
deepEqual({ a: 1 }, { a: 1 }); // true
deepEqual([1, 2], [1, 2]); // true
deepEqual({ a: 1 }, { a: 2 }); // false
```

### Loose vs strict comparison

By default, comparison is strict (`===`). Disable it to allow loose equality for primitives.

```ts
deepEqual(1, '1'); // false
deepEqual(1, '1', { strict: false }); // true
deepEqual(0, false, { strict: false }); // true
```

### Ignoring object keys

Ignore specific **top-level** keys when comparing objects.

```ts
deepEqual({ a: 1, b: 2 }, { a: 1, b: 99 }, { ignoreKeys: ['b'] }); // true
```

Nested paths are not supported:

```ts
deepEqual({ a: { b: 1 } }, { a: { b: 2 } }, { ignoreKeys: ['a.b'] }); // false
```

### Arrays, Dates, and RegExps

```ts
deepEqual([1, { a: 2 }], [1, { a: 2 }]); // true

deepEqual(new Date('2023-01-01'), new Date('2023-01-01')); // true

deepEqual(/abc/i, /abc/i); // true
deepEqual(/abc/i, /abc/g); // false
```

### Circular references

Safely handles circular and deeply nested structures.

```ts
const a: any = {};
a.self = a;

const b: any = {};
b.self = b;

deepEqual(a, b); // true
```

### Symbol keys

Symbol properties are compared by default and can be ignored via `symbol.toString()`.

```ts
const sym = Symbol('id');

deepEqual({ [sym]: 1 }, { [sym]: 1 }); // true

deepEqual({ [sym]: 1 }, { [sym]: 2 }, { ignoreKeys: [sym.toString()] }); // true
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/deep-equal).

## 🚀 Performance

| Library                | Equal Objects (ops/sec) | Unequal Objects (ops/sec) | Circular References (Equal) (ops/sec) | Circular References (Unequal) (ops/sec) | Simple Circular References (Equal) (ops/sec) |
| :--------------------- | :---------------------- | :------------------------ | :------------------------------------ | :-------------------------------------- | :------------------------------------------- |
| **@se-oss/deep-equal** | _2,527,249_             | _895,175_                 | _3,667,331_                           | _6,392,142_                             | _3,954,003_                                  |
| deep-equal             | 8,658                   | 1,842                     | 5,961                                 | 8,389                                   | 6,017                                        |
| lodash.isEqual         | 1,555,288               | 344,628                   | 1,264,089                             | 1,999,934                               | 1,322,176                                    |

_Benchmark script: [`bench/index.bench.ts`](bench/index.bench.ts)_

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-deep-equal).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-deep-equal/graphs/contributors).
