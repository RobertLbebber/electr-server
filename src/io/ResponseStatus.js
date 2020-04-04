import { CLIENT_UNKNOWN, SUCCESS } from "./HttpErrors";

/**
 * For Internal Objects MultiStatus
 * @param {*} status
 * @param {*} message
 * @param {*} code
 */
export const StatusObject = (status, message, code = status ? 0 : 1) => {
  let obj = { status, message, code };
  // obj.constructor.name = "StatusObject";
  return obj;
};

/**
 * Responses to the Frontend and the API
 * @param {*} ok
 * @param {*} payload
 * @param {*} statusCode
 */
const ResponseStatus = (
  ok = true,
  payload = ok ? "Successful" : "Failure",
  statusCode = ok ? SUCCESS : CLIENT_UNKNOWN,
) => {
  let response = { ok, statusCode };
  // response.constructor.name = "ResponseStatus";

  if (payload.constructor === String) {
    response.body = payload;
    response.headers = { "Content-Type": "text/plain" };
  } else if (payload.constructor === Object) {
    response.body = JSON.stringify(payload);
    response.headers = { "Content-Type": "application/json" };
  }
  return response;
};

export const GET = "GET";
export const POST = "POST";
export const PUT = "PUT";
export const DELETE = "DELETE";

export default ResponseStatus;
