import _ from "lodash";
import GenerateEndpoint from "./GenerateEndpoint";

export class GenericController {
  constructor() {
    this.endpoints = {};
  }

  getName = () => this.constructor.name;
  /**
   * Opens up a Stream to create a endpoint
   *
   * @param {String} name - Name of the Endpoint
   */
  create = (name) => GenerateEndpoint.init(name, this);
}
