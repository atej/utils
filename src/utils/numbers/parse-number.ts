export function parseNumber(value: unknown): Result<number> {
  const parsed = value === null || value === undefined ? NaN : parseFloat(value.toString())

  if (isNaN(parsed) || !isFinite(parsed)) {
    return {
      data: undefined,
      success: false,
    }
  }

  return {
    data: parsed,
    success: true,
  }
}
