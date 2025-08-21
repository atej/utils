import { omitBy } from '@remeda/remeda'
import type { OmitBy } from '../types/omit-by.ts'
import type { UnknownObject } from '../types/unknown-object.ts'

/**
 * Omit nullish values from an object.
 */
export function omitNullish<TObject extends UnknownObject>(
  obj: TObject,
): FnReturnType<TObject> {
  return omitBy(obj, (value) => value === undefined || value === null) as FnReturnType<TObject>
}

type FnReturnType<TObject extends UnknownObject> = OmitBy<TObject, null | undefined>
