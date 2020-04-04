import { Models as RawModels } from "../../db/models/_export.json.js";
import ResponseStatus, { POST, GET, DELETE } from "../../io/ResponseStatus";
import GenerateHandler from "../_common/GenerateHandler";
import { GenericController } from "../_common/GenericController.js";
import env, { DEVELOPMENT } from "../../config/env.js";

const postGets = {
  get: {
    method: GET,
    crud: async (event, fn) => {
      return await fn(event.Key, event.other);
    },
  },
  query: {
    method: POST,
    crud: async (event, fn) => {
      return await fn(event.Item, event.other);
    },
  },
  create: {
    method: POST,
    crud: async (event, fn) => {
      return await fn(JSON.parse(event.body).Item, event.other);
    },
  },
  crement: {
    method: GET,
    crud: async (event, fn) => {
      return await fn(event.Key, event.other);
    },
  },
  update: {
    method: POST,
    crud: async (event, fn) => {
      return await fn(event.Key, event.Item, event.other);
    },
  },
  createUpdate: {
    method: POST,
    crud: async (event, fn) => {
      return await fn(event.Item, event.other);
    },
  },
  remove: {
    method: DELETE,
    crud: async (event, fn) => {
      return await fn(event.Item, event.other);
    },
  },
  scan: {
    method: GET,
    crud: async (event, fn) => {
      return await fn();
    },
  },
};

class DebugController extends GenericController {}
let init = new DebugController();

let endpoints = {};
let controllers = {};
for (let controllerName in RawModels) {
  let functions = RawModels[controllerName].fn;
  for (let funcName in functions) {
    let publicFuncName = controllerName + "_" + funcName;
    GenerateHandler.genFn(
      init,
      publicFuncName,
      "/" + controllerName + "/debug/" + funcName,
      false,
      postGets[funcName].method,
    )(async event => {
      let result = await postGets[funcName].crud(event, functions[funcName]);
      return ResponseStatus(true, result);
    });
    controllers[publicFuncName] = init[publicFuncName];
  }
  endpoints = { ...endpoints, ...GenerateHandler.expFn(init) };
}

module.exports = env.mode === DEVELOPMENT ? { ...endpoints, DebugController: controllers } : {};
