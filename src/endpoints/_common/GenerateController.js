import _ from "lodash";
import { Validator } from "jsonschema";
import ResponseStatus, { GET, POST, PUT, DELETE } from "../../io/ResponseStatus";
import WebError, { SERVER_UNKNOWN, SERVER_DEFAULT, SERVICE_NOT_AVAILABLE } from "../../io/HttpErrors";
import Middleware from "../../middleware/Middleware";
import env, { DEVELOPMENT } from "../../config/env";

export default class GenerateController {
  constructor(name, controller) {
    //Essentials
    this._controller = controller;
    this._fn = undefined;
    this._rest = GET;
    this._name = name;
    this._path = name;
    //Rules
    this._policy = [];
    this._session = true;
    this._dynamicPath = [];
    this._request = undefined;
    this._response = undefined;
    //Decoration
    this._description = undefined;
    this._contentType = "application/json";
    this._contentAccept = "application/json";
    //Environment
    this._debug = false;
    this._models = controller.models;
  }

  static init = (name, controller) => new GenerateController(name, controller);

  toJSON() {
    return {
      //Essentials
      fn: this._fn,
      rest: this._rest,
      name: this._name,
      path: this._path,
      //Rules
      policy: this._policy,
      request: this._request,
      response: this._response,
      session: this._session,
      dynamicPath: this._dynamicPath,
      //Decoration
      description: this._description,
      contentType: this._contentType,
      contentAccept: this._contentAccept,
      //Environment
      debug: this._debug,
      models: this._models,
    };
  }

  /**
   * @todo Add Audits
   * @param {Function} value
   *
   * @typedef {Function} fn - Endpoint Function to be called on
   *  @property {AWS.Event} event -
   *  @property {AWS.Context} context -
   *  @property {GenerateController} endpoint -
   *  @property {GenericController} globals -
   *
   * @returns {GenericController}
   */
  fn(value) {
    this._fn = value;

    let parsedStream = this.toJSON();
    this._controller.endpoints[this._name] = parsedStream;

    if (_.isNil(this._controller.endpoints[this._name].fn)) {
      throw new Error("GenerateController miss required Property: 'fn'");
    } else {
      //Extending the Provided Function with Middleware and Endware
      this._controller.endpoints[this._name].fn = async (event, context, callback) => {
        try {
          //Handling Middleware
          let middles = await Middleware.prep(event, context, parsedStream);
          if (!middles.ok) {
            return ResponseStatus(middles.ok, middles, _.get(middles, "errorCode", SERVER_DEFAULT));
          }

          /**
           * This is the function that gets called by the Controller as [fn(...)]
           */
          return await this._fn(event, context, parsedStream, this._controller);
        } catch (error) {
          let isWebError = !_.isNil(error.code);
          //Endware Handling Errors
          console.error(`! ${error.name}[${isWebError ? error.code : SERVER_UNKNOWN}] - ${error.message}`);
          return ResponseStatus(false, error.message, isWebError ? error.code : SERVER_UNKNOWN);
        }
      };
    }
    return this._controller;
  }

  path(value, prefix = false, suffix = false) {
    this._path = prefix ? value + this._path : value;
    this._path = suffix ? this._path + value : this._path;
    return this;
  }

  //Dynamic Paths
  dynamic(array) {
    this._dynamicPath = array;
    return this;
  }

  //Session
  open() {
    this._session = false;
    return this;
  }

  //Policy
  constraints(array) {
    this._policy = array;
    return this;
  }

  request(request) {
    this._request = event => new Validator().validate(JSON.parse(event.body), request);
    return this;
  }

  /**
   *
   * @param {Object| Object[]} response
   */
  response(response) {
    this._response = event => new Validator().validate(JSON.parse(event.body), { oneOf: response });
    return this;
  }

  /**
   * @todo Not current implemented to limit or validate requests @see [routes.json.js]
   *
   * @param {String} value - Return Content Types (deliminated by ",")
   */
  contentType(value) {
    this._contentType = value;
    return this;
  }

  /**
   * @todo Not current implemented to limit or validate requests @see [routes.json.js]
   *
   * @param {String} value - Acceptible Content Types (deliminated by ",")
   */
  contentAccept(value) {
    this._contentAccept = value;
    return this;
  }

  rest(value) {
    this._rest = value;
    return this;
  }

  //Delete
  deleter() {
    this._rest = DELETE;
    return this;
  }

  put() {
    this._rest = PUT;
    return this;
  }
  get() {
    this._rest = GET;
    return this;
  }

  post() {
    this._rest = POST;
    return this;
  }

  debug() {
    if (env.mode !== DEVELOPMENT) {
      throw new WebError(SERVICE_NOT_AVAILABLE);
    }
    return this;
  }

  description() {
    this._description = true;
    return this;
  }

  doneFn() {
    this._controller[this._name] = this.toJSON();
    return this._controller;
  }
}
