import _ from "lodash";
import WebError, { NOT_INSTANTIATED } from "io/HttpErrors";

export default class CommonDoc {
  /**
   *
   * @param {*} Model
   * @param {String| Object} identity
   */
  constructor(Model, identity) {
    this.Model = Model;
    if (_.isNil(this.Model)) {
      throw new WebError(
        NOT_INSTANTIATED,
        `No Model was provided to create a ModelDoc for.`
      );
    }
    this.properties = this.Model.properties;
    this.pK = this.Model.pK;
    this.docName = `${this.Model.modelName}Doc`;
    if (_.isNil(identity)) {
      throw new WebError(
        NOT_INSTANTIATED,
        `${this.docName} was not provide an identity.`
      );
    }

    this.identity = identity;
  }
  /**@interface*/
  async save() {
    let Item = {};
    if (_.isString(this.identity)) {
      Item[this.pK] = this.identity;
    }
    await this.Model.fn.create(Item);
  }
  async record() {
    let Item = {};
    if (_.isString(this.identity)) {
      Item[this.pK] = this.identity;
    } else {
      Item = this.identity;
    }
    return await this.Model.fn.record(Item);
  }
  async get(dynoExpression = {}) {
    if (_.isString(this.identity)) {
      return await this.Model.fn.get(this.identity, dynoExpression);
    } else {
      return await this.Model.fn.get(this.identity[this.pK], dynoExpression);
    }
  }
  async find(dynoExpression = {}) {
    return await this.Model.fn.scan(this.identity, dynoExpression);
  }
}
