export default {
  '*': 'deno fmt',
  '*.{ts,tsx}': [() => 'deno lint', () => 'deno check', () => 'vitest run'],
}
