import WebError, { NOT_INSTANTIATED } from "../../io/HttpErrors";

export default class SingletonGenerator {
  /**
   * @param {Class} Model - Blueprint of the Model to be created into a Singleton
   */
  constructor(Model) {
    this.instance;
    this.Model = Model;
    this.createInstance = function createInstance() {
      this.instance = new this.Model();
      return this.instance;
    };

    this.sealInstance = function sealInstance() {
      this.instance.init();
      Object.preventExtensions(this.instance);
      return this.instance;
    };

    this.getInstance = function getInstance() {
      if (!this.instance) {
        throw new WebError(NOT_INSTANTIATED, "Model called with out be created");
      }
      return this.instance;
    };
  }
}
