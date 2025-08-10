export default {
  '*': 'deno fmt',

  '*.ts': [() => 'deno lint', () => 'vitest run'],
}
