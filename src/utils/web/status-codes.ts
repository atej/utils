/**
 * A subset of commonly used HTTP status codes for success.
 *
 * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
 */
export const SUCCESS_STATUS = {
  /**
   * The HTTP 200 OK successful response status code indicates that a request has
   * succeeded. A 200 OK response is cacheable by default.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
   */
  OK: 200,
  /**
   * The HTTP 201 Created successful response status code indicates that the HTTP
   * request has led to the creation of a resource. This status code is commonly
   * sent as the result of a POST request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201)
   */
  CREATED: 201,
  /**
   * The HTTP 202 Accepted successful response status code indicates that a request
   * has been accepted for processing, but processing has not been completed or may
   * not have started. The actual processing of the request is not guaranteed; a
   * task or action may fail or be disallowed when a server tries to process it.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202)
   */
  ACCEPTED: 202,
  /**
   * The HTTP 204 No Content successful response status code indicates that a request
   * has succeeded, but the client doesn't need to navigate away from its current
   * page. A 204 response is cacheable by default, and an ETag header is included
   * in such cases.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204)
   */
  NO_CONTENT: 204,
  /**
   * The HTTP 205 Reset Content successful response status code indicates that the
   * request has been successfully processed and the client should reset the document
   * view.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/205)
   */
  RESET_CONTENT: 205,
  /**
   * The HTTP 206 Partial Content successful response status code is sent in response
   * to a range request. The response body contains the requested ranges of data as
   * specified in the Range header of the request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)
   */
  PARTIAL_CONTENT: 206,
} as const

/**
 * A subset of commonly used HTTP status codes for redirects.
 *
 * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
 */
export const REDIRECT_STATUS = {
  /**
   * The HTTP 301 Moved Permanently redirection response status code indicates that
   * the requested resource has been permanently moved to the URL in the Location
   * header.
   */
  PERMANENT: 301,
  /**
   * The HTTP 302 Found redirection response status code indicates that the requested
   * resource has been temporarily moved to the URL in the Location header.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302)
   */
  TEMPORARY: 302,
  /**
   * The HTTP 303 See Other redirection response status code indicates that the
   * browser should redirect to the URL in the Location header instead of rendering
   * the requested resource. The method to retrieve the redirected resource is always
   * GET.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303)
   */
  TEMPORARY_GET: 303,
  /**
   * The HTTP 307 Temporary Redirect redirection response status code indicates that
   * the resource requested has been temporarily moved to the URL in the Location
   * header. The method and the body of the original request are reused to perform
   * the redirected request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307)
   */
  TEMPORARY_SAME: 307,
  /**
   * The HTTP 308 Permanent Redirect redirection response status code indicates that
   * the requested resource has been permanently moved to the URL given by the
   * Location header. The request method and the body will not be modified by the
   * client in the redirected request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308)
   */
  PERMANENT_SAME: 308,
} as const

/**
 * A subset of commonly used HTTP status codes for client errors.
 *
 * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
 */
export const CLIENT_ERROR_STATUS = {
  /**
   * The HTTP 400 Bad Request response status code indicates that the server cannot
   * or will not process the request due to something that is perceived to be a
   * client error (e.g., malformed request syntax, invalid request message framing,
   * or deceptive request routing).
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
   */
  BAD_REQUEST: 400,
  /**
   * The HTTP 401 Unauthorized response status code indicates that the request has
   * not been applied because it lacks valid authentication credentials for the target
   * resource.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)
   */
  UNAUTHENTICATED: 401,
  /**
   * The HTTP 403 Forbidden response status code indicates that the server understood
   * the request but refuses to authorize it. The server is refusing to fulfill the
   * request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
   */
  UNAUTHORIZED: 403,
  /**
   * The HTTP 404 Not Found response status code indicates that the server cannot
   * find the requested resource. Links that lead to a 404 page are often called
   * broken or dead links and can be subject to link rot.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)
   */
  NOT_FOUND: 404,
  /**
   * The HTTP 405 Method Not Allowed response status code indicates that the request
   * method is known by the server but is not supported by the target resource.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405)
   */
  BAD_METHOD: 405,
  /**
   * The HTTP 410 Gone client error response status code indicates that the target
   * resource is no longer available at the origin server and that this condition
   * is likely to be permanent. A 410 response is cacheable by default. It's used
   * to indicate to crawlers like Google to completely remove a page from their
   * search index.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410)
   */
  PERMANENT_NOT_FOUND: 410,
  /**
   * The HTTP 429 Too Many Requests response status code indicates that the user has
   * sent too many requests in a given amount of time ("rate limiting").
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
   */
  TOO_MANY_REQUESTS: 429,
} as const

/**
 * A subset of commonly used HTTP status codes for server errors.
 *
 * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
 */
export const SERVER_ERROR_STATUS = {
  /**
   * The HTTP 500 Internal Server Error response status code indicates that the server
   * encountered an unexpected condition that prevented it from fulfilling the request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500)
   */
  INTERNAL: 500,
  /**
   * The HTTP 501 Not Implemented response status code indicates that the server does
   * not support the functionality required to fulfill the request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501)
   */
  NOT_IMPLEMENTED: 501,
  /**
   * The HTTP 502 Bad Gateway response status code indicates that the server, while
   * working as a gateway to get a response needed to handle the request, got an
   * invalid response from the upstream server it accessed in attempting to fulfill
   * the request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502)
   */
  THIRD_PARTY: 502,
  /**
   * The HTTP 503 Service Unavailable response status code indicates that the server
   * is temporarily unable to handle the request due to being overloaded or down for
   * maintenance.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503)
   */
  MAINTENANCE: 503,
  /**
   * The HTTP 504 Gateway Timeout response status code indicates that the server,
   * while acting as a gateway, did not get a response in time from the upstream
   * server that it needed to access in order to complete the request.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504)
   */
  THIRD_PARTY_TIMEOUT: 504,
} as const

/**
 * A subset of commonly used HTTP status codes.
 *
 * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
 */
export const STATUS = {
  // 2xx Success
  SUCCESS: SUCCESS_STATUS,
  '✅': SUCCESS_STATUS,

  // 3xx Redirects
  REDIRECT: REDIRECT_STATUS,
  '↪️': REDIRECT_STATUS,

  // 4xx Client Errors
  CLIENT_ERROR: CLIENT_ERROR_STATUS,
  '❌': CLIENT_ERROR_STATUS,

  // 5xx Server Errors
  SERVER_ERROR: SERVER_ERROR_STATUS,
  '💥': SERVER_ERROR_STATUS,
} as const
