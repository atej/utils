import { isIncludedIn, keys } from '@remeda/remeda'
import { gatherError } from '../../../objects/gather-error.ts'
import { omitNullish } from '../../../objects/omit-nullish.ts'
import { getUserLang } from '../../../web/get-user-lang.ts'
// Type Imports
import type { Result } from '../../../types/result.ts'
import type { RazorpayCheckoutParams } from '../checkout-params.schema.ts'
import type { RazorpayCheckoutLang } from '../data.ts'

/**
 * Open the Razorpay checkout modal. Return {success: true} if the modal is opened successfully, or an error.
 */
export async function openRazorpayCheckout(
  params: RazorpayCheckoutParams,
  options?: {
    onSuccess?: OnSuccess
    onDismiss?: OnDismiss
  },
): Promise<Result<{ success: true }, Error>> {
  try {
    const { error, data: Razorpay } = await loadRazorpay()
    if (error) throw error
    const mergedParams = {
      ...params,
      ...(options?.onSuccess ? { onSuccess: options.onSuccess } : {}),
      ...(options?.onDismiss ? { modal: { ...params.modal, onDismiss: options.onDismiss } } : {}),
    } satisfies RazorpayCheckoutParams
    const checkoutApiOptions = gatherCheckoutOptions(mergedParams)
    const razorpay = new Razorpay(checkoutApiOptions)
    razorpay.open()
    return { data: { success: true }, error: undefined }
  } catch (error) {
    return { data: undefined, error: gatherError(error) }
  }
}

///////////////////////
// #region HELPERS ////
///////////////////////

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
 * Optionally, set a function to be called when on a successful payment.
 * Optionally, set a function to be called when the modal is dismissed.
 */
function gatherCheckoutOptions(
  params: RazorpayCheckoutParams,
): RazorpayCheckoutApiOptions {
  const options = omitNullish({
    key: params.key,
    amount: params.amount,
    currency: params.currency,
    order_id: params.orderId,
    name: params.businessName,
    notes: params.notes,
    handler: params.onSuccess as OnSuccess | undefined,
    callback_url: params.callbackUrl,
    redirect: params.redirectOnFailure,
    description: params.description,
    image: params.logoImage,
    prefill: omitNullish({
      name: params.prefill?.name,
      email: params.prefill?.email,
      contact: params.prefill?.phoneWithPhoneCode,
      method: params.prefill?.method,
    }),
    readonly: omitNullish({
      name: params.readonly?.name,
      email: params.readonly?.email,
      contact: params.readonly?.phoneWithPhoneCode,
    }),
    hidden: omitNullish({
      email: params.hidden?.email,
      contact: params.hidden?.phoneWithPhoneCode,
    }),
    theme: omitNullish({
      color: params.theme?.color,
      backdrop_color: params.theme?.backdropColor,
    }),
    modal: omitNullish({
      ondismiss: params.modal?.onDismiss as OnDismiss | undefined,
      backdropclose: params.modal?.closeOnBackdropClick,
      escape: params.modal?.closeOnEscape,
      handleback: params.modal?.closeOnBrowserBack,
      confirm_close: params.modal?.confirmClose,
      animation: params.modal?.animateOpening,
    }),
    subscription_id: params.subscriptionId,
    subscription_card_change: params.allowSubscriptionCardChange,
    recurring: params.recurring,
    customer_id: params.customerId,
    remember_customer: params.rememberCustomer,
    timeout: params.timeout,
    send_sms_hash: params.sendSmsHash,
    allow_rotation: params.allowRotation,
    retry: omitNullish({
      enabled: params.retry?.enabled,
      max_count: params.retry?.maxCount,
    }),
    config: omitNullish({
      display: { language: params.config?.display?.language ?? getCheckoutLang() },
    }),
  }) satisfies RazorpayCheckoutApiOptions

  return options
}

/**
 * Get the Razorpay checkout modal language from the language of the user's browser.
 */
function getCheckoutLang(): RazorpayCheckoutLang {
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

///////////////////////
// #endregion /////////
///////////////////////

//////////////////////////
// #region Razorpay API //
//////////////////////////

/**
 * Type that represents a Razorpay checkout options object with custom `notes` type.
 *
 * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/#123-checkout-options
 */
export type RazorpayCheckoutApiOptions = {
  key: string
  amount: number
  currency: string
  order_id: string
  /** Name of the business. NOT the name of the customer e.g. Acme Corp. */
  name: string
  notes: Record<string, string>
  handler: (response: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }) => void
  callback_url: string
  description: string
  image: string
  prefill: {
    name: string
    email: string
    contact: string
    method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi'
  }
  readonly: {
    email: boolean
    contact: boolean
    name: boolean
  }
  hidden: {
    email: boolean
    contact: boolean
  }
  theme: {
    color: string
    backdrop_color: string
  }
  modal: {
    ondismiss: () => void
    backdropclose: boolean
    escape: boolean
    handleback: boolean
    confirm_close: boolean
    animation: boolean
  }
  subscription_id: string
  subscription_card_change: boolean
  recurring: boolean
  redirect: boolean
  customer_id: string
  remember_customer: boolean
  timeout: number
  send_sms_hash: boolean
  allow_rotation: boolean
  retry: {
    enabled: boolean
    max_count: number
  }
  config: {
    display: {
      language: string
    }
  }
}

type RazorpayConstructor = new (options: RazorpayCheckoutApiOptions) => { open: () => void }
type LoadRazorpayResult = Result<RazorpayConstructor>
type OnDismiss = RazorpayCheckoutApiOptions['modal']['ondismiss']
type OnSuccess = RazorpayCheckoutApiOptions['handler']

//////////////////////////
// #endregion ///////////
//////////////////////////
