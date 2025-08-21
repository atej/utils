import { isBrowser } from '@es-toolkit/es-toolkit'
import { isIncludedIn, keys } from '@remeda/remeda'
import type { RequireExactlyOne } from 'type-fest'
import { jsonc } from '../../../json/json.ts'
import type { Result } from '../../../types/result.ts'
import { getUserLang } from '../../../web/get-user-lang.ts'
import type { RAZORPAY_CHECKOUT_LANGS } from '../data.ts'
import type { RazorpayCheckoutOptions } from '../schemas.ts'

type RazorpayCheckoutLang = (typeof RAZORPAY_CHECKOUT_LANGS)[number]
type RazorpayConstructor = new (options: unknown) => { open: () => void }
type LoadRazorpayResult = Result<RazorpayConstructor>
type Deserializer = (options: string) => RazorpayCheckoutOptions

function defaultDeserializer(options: string): RazorpayCheckoutOptions {
  const { error, data } = jsonc.parse(options)
  if (error) throw error
  return data as RazorpayCheckoutOptions
}

type OpenRazorpayCheckoutParameters =
  & RequireExactlyOne<{
    options: RazorpayCheckoutOptions
    serialized: { options: string; deserializer?: Deserializer }
  }>
  & {
    onDismiss?: () => void
  }

/**
 * Open the Razorpay checkout modal. Return {success: true} if the modal is opened successfully, or an error.
 */
export async function openRazorpayCheckout(
  params: OpenRazorpayCheckoutParameters,
): Promise<Result<{ success: true }, Error>> {
  try {
    if (!isBrowser()) throw new Error('use openRazorpayCheckout in the browser')

    const { error, data: Razorpay } = await loadRazorpay()
    if (error) throw error

    if (params.serialized) {
      const deserializer = params.serialized.deserializer ?? defaultDeserializer
      const options = deserializer(params.serialized.options)
      const finalizedOptions = finalizeRazorpayCheckoutOptions(options, params.onDismiss)
      const razorpay = new Razorpay(finalizedOptions)
      razorpay.open()
    } else {
      const finalizedOptions = finalizeRazorpayCheckoutOptions(params.options, params.onDismiss)
      const razorpay = new Razorpay(finalizedOptions)
      razorpay.open()
    }

    return {
      data: { success: true },
      error: undefined,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error(String(error)),
      data: undefined,
    }
  }
}

////////////////////
//// 🪛 HELPERS ////
////////////////////

/**
 * Get the Razorpay constructor by loading the Razorpay checkout script.
 */
async function loadRazorpay(): Promise<LoadRazorpayResult> {
  console.log('⚙️ loading razorpay script...')
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  document.head.appendChild(script)

  const loadResult = await new Promise<LoadRazorpayResult>((resolve, reject) => {
    script.onload = () => {
      console.log('✅ razorpay script loaded')
      resolve({
        error: undefined,
        // @ts-expect-error - At this point, Razorpay will be defined on window
        data: globalThis.Razorpay as unknown as RazorpayConstructor,
      })
    }
    script.onerror = (error) => {
      console.error('❌ razorpay script failed to load')
      reject({
        error: typeof error === 'string' ? new Error(error) : error,
        data: undefined,
      })
    }
  })

  return loadResult
}

/**
 * Set the display language of the Razorpay checkout modal to the language of the user's browser.
 * Optionally, set a function to be called when the modal is dismissed.
 */
function finalizeRazorpayCheckoutOptions(
  options: RazorpayCheckoutOptions,
  onDismiss?: () => void,
): RazorpayCheckoutOptions {
  const { config, modal, ...rest } = options

  return {
    ...rest,
    modal: { ...(onDismiss ? { ondismiss: onDismiss } : {}), ...modal },
    config: { display: { language: getRazorpayCheckoutLang() }, ...config },
  }
}

/**
 * Get the Razorpay checkout modal language from the language of the user's browser.
 */
function getRazorpayCheckoutLang(): RazorpayCheckoutLang {
  const LANG_MAP = {
    en: 'en',
    bn: 'ben',
    hi: 'hi',
    mr: 'mar',
    gu: 'guj',
    ta: 'tam',
    te: 'tel',
  } as const
  const userLang = getUserLang()
  return isIncludedIn(userLang, keys(LANG_MAP)) ? LANG_MAP[userLang] : 'en'
}
