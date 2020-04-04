import _ from "lodash";

//Successes
export const SUCCESS = 200;
export const PARTIAL_CONTENT = 206;
export const MULTI_STATUS = 207;
//Client-side Errors
export const CLIENT_GENERIC = 400;
export const UNAUTHORIZED = 401;
export const PAYMENT_FAILURE = 402;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const INVALID_INPUT = 405; //Inputs are not valid based on a schema or cross-key check
export const CONFLICT = 409;
export const PRECONDITION = 412;
export const UNPROCESSABLE_ENTITY = 422;
export const CLIENT_UNKNOWN = 495;
//Server-side Error
export const SERVER_DEFAULT = 500;
export const NOT_IMPLEMENTED = 501;
export const BAD_GATEWAY = 502; //Failed API to another application (3rd Party)
export const SERVICE_NOT_AVAILABLE = 503;
export const HTTP_NOT_SUPPORTED = 504;
export const DATABASE_FAILURE = 512; //Interaction with Database Errors
export const DATABASE_REJECTION = 513; //Preliminary Rejections prior to the subject transaction rendered transaction rejected
export const DATABASE_UNKNOWN = 519;
export const NOT_INSTANTIATED = 520;
export const SERVER_UNKNOWN = 595;

export default class WebError extends Error {
  constructor(errorCode, customErrorMsg) {
    super(customErrorMsg);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WebError);
    }
    let displayMessage = !_.isEmpty(customErrorMsg) || !_.isEmpty(this.message) ? ": " : " ";
    displayMessage += !_.isEmpty(customErrorMsg) ? customErrorMsg : this.message;

    switch (errorCode) {
      //Client Errors
      case CLIENT_GENERIC:
        this.code = CLIENT_GENERIC;
        this.name = _.startCase("CLIENT_GENERIC");
        this.message = "User made an invalid action" + displayMessage;
        break;
      case UNAUTHORIZED:
        this.code = UNAUTHORIZED;
        this.name = _.startCase("UNAUTHORIZED");
        this.message = "User is unauthorized for this action" + displayMessage;
        break;
      case PAYMENT_FAILURE:
        this.code = PAYMENT_FAILURE;
        this.name = _.startCase("PAYMENT_FAILURE");
        this.message = "Payment transaction was not successful" + displayMessage;
        break;
      case FORBIDDEN:
        this.code = FORBIDDEN;
        this.name = _.startCase("FORBIDDEN");
        this.message = "The action attempted by the user id forbidden" + displayMessage;
        break;
      case NOT_FOUND:
        this.code = NOT_FOUND;
        this.name = _.startCase("NOT_FOUND");
        this.message = "Resources was not found or is not available" + displayMessage;
        break;
      case INVALID_INPUT:
        this.code = INVALID_INPUT;
        this.name = _.startCase("INVALID_INPUT");
        this.message = "The provide information inputed was not valid" + displayMessage;
        break;
      case CONFLICT:
        this.code = CONFLICT;
        this.name = _.startCase("CONFLICT");
        this.message = "There was a conflict with the desired resource" + displayMessage;
        break;
      case PRECONDITION:
        this.code = PRECONDITION;
        this.name = _.startCase("PRECONDITION");
        this.message = "The action attempted is dependent on a precondition that was not met" + displayMessage;
        break;
      case UNPROCESSABLE_ENTITY:
        this.code = UNPROCESSABLE_ENTITY;
        this.name = _.startCase("UNPROCESSABLE_ENTITY");
        this.message = "The provided information was unable to be processed through standard means" + displayMessage;
        break;
      //Server Errors
      case SERVER_DEFAULT:
        this.name = _.startCase("SERVER_DEFAULT");
        this.code = SERVER_DEFAULT;
        this.message = "The server failed to complete an action" + displayMessage;
        break;
      case NOT_IMPLEMENTED:
        this.code = NOT_IMPLEMENTED;
        this.name = _.startCase("NOT_IMPLEMENTED");
        this.message =
          "The action requested is dependent on a feature that is not available at this time" + displayMessage;
        break;
      case BAD_GATEWAY:
        this.code = BAD_GATEWAY;
        this.name = _.startCase("BAD_GATEWAY");
        this.message = "The action failed when acting as a gateway" + displayMessage;
        break;
      case SERVICE_NOT_AVAILABLE:
        this.code = SERVICE_NOT_AVAILABLE;
        this.name = _.startCase("SERVICE_NOT_AVAILABLE");
        this.message = "The service attempted to reach is unavailable at this time" + displayMessage;
        break;
      case HTTP_NOT_SUPPORTED:
        this.code = HTTP_NOT_SUPPORTED;
        this.name = _.startCase("HTTP_NOT_SUPPORTED");
        this.message = "The network connection must be secure to ensure privacy" + displayMessage;
        break;
      // Database
      case DATABASE_FAILURE:
        this.code = DATABASE_FAILURE;
        this.name = _.startCase("DATABASE_FAILURE");
        this.message = "There was a failure to complete a database transaction" + displayMessage;
        break;
      case DATABASE_REJECTION:
        this.code = DATABASE_REJECTION;
        this.name = _.startCase("DATABASE_REJECTION");
        this.message = "The database's preconditions rejected the transaction" + displayMessage;
        break;
      case DATABASE_UNKNOWN:
        this.code = DATABASE_UNKNOWN;
        this.name = _.startCase("DATABASE_UNKNOWN");
        this.message = "The database failed complete a transaction" + displayMessage;
        break;
      // Server Again
      case NOT_INSTANTIATED:
        this.code = NOT_INSTANTIATED;
        this.name = _.startCase("NOT_INSTANTIATED");
        this.message = "There was an attempt to act on a service that was not prepared" + displayMessage;
        break;
      case SERVER_UNKNOWN:
        this.code = SERVER_UNKNOWN;
        this.name = _.startCase("SERVER_UNKNOWN");
        this.message = "The server failed complete an action for unknown reasons" + displayMessage;
        break;
      default:
        //Default Error, defaults to Client Unknown Error
        this.code = CLIENT_UNKNOWN;
        this.name = _.startCase("CLIENT_UNKNOWN");
        this.message = "The user attempted to preform an action that failed for unknown reasons" + displayMessage;
    }
  }
}
