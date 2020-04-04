import _ from "lodash";
import GenerateController from "./GenerateController";
import { Singletons } from "../../db/models/_export.json";

export class GenericController {
  constructor() {
    this.endpoints = {};
    _.each(Singletons, Singleton => Singleton.createInstance());
    _.each(Singletons, Singleton => Singleton.sealInstance());
  }

  getName = () => this.constructor.name;
  /**
   * Opens up a Stream to create a endpoint
   *
   * @param {String} name - Name of the Endpoint
   */
  create = name => GenerateController.init(name, this);
}
