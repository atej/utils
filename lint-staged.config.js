export default {
  '*': 'prettier --cache --ignore-unknown --write',

  '*.ts': [() => 'tsc --noEmit', () => 'vitest run'],
}
