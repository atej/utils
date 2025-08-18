# Utilities

## Installation

```shell
# npm
npx jsr add @atej/utils

# deno
deno add jsr:@atej/utils
```

## Usage

Import a utility:

```typescript
import { parseNumber } from '@atej/utils'
```

Import a type utility:

```typescript
import type { Equal } from '@atej/utils'
```

## Entrypoints

- [`@atej/utils`](https://jsr.io/@atej/utils/doc#default): Main entrypoint (server+browser)
- [`@atej/utils/cloudflare`](https://jsr.io/@atej/utils/doc#cloudflare): Cloudflare utilities that
  take incoming request's Cloudflare properties as an argument (server-only)
- [`@atej/utils/crypto`](https://jsr.io/@atej/utils/doc#crypto): Cryptographic utilities that depend
  on `node:crypto` (server-only)
- [`@atej/utils/razorpay`](https://jsr.io/@atej/utils/doc#razorpay): Razorpay payment gateway
  utilities (server-only)
- [`@atej/utils/types`](https://jsr.io/@atej/utils/doc#types): General type-level utilities

## Docs

[View on JSR](https://jsr.io/@atej/utils/doc)

## Notes

The package is published with --allow-slow-types to make exporting zod schemas viable.
