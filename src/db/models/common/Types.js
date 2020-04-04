import _ from "lodash";
import WebError, { DATABASE_REJECTION } from "../../../io/HttpErrors";

/**
 *
 * @param {*} entryExist
 * @param {*} refId
 * @param {Model} foreignModel
 */
const checkDetection = (entryExist, refId, foreignModel) => {
  if (_.isEmpty(entryExist)) {
    let error =
      "No Entry for given Foreign Key '" +
      refId +
      "' found in '" +
      _.get(foreignModel, "modelName", "No Foreign Model") +
      "'.";
    throw new WebError(DATABASE_REJECTION, error);
  }
};

export class Ref {
  dbType = "B";
  /**
   * @param {Model} foreigner - reference to an instance of a foreign model
   * @param {String} connection - property being used for connecting the models
   */
  constructor(foreigner, validate = true) {
    // console.log("Types.js", foreigner);
    if (validate) {
      this.foreignModel = foreigner;
      this.foreignKey = foreigner.pK;
      if (_.isNil(this.foreignModel)) {
        throw new WebError(
          DATABASE_REJECTION,
          "No foriegn Model provided for Reference"
        );
      }
    }
  }

  async validator(refId) {
    if (_.isNil(this.foreignModel)) {
      throw new WebError(
        DATABASE_REJECTION,
        "No foriegn Model provided for Reference"
      );
    } else if (_.isNil(refId)) {
      throw new WebError(
        DATABASE_REJECTION,
        "Foreign Model lacks identification for Reference"
      );
    }
    let entryExist = await this.foreignModel.fn.get(refId);
    checkDetection(entryExist, refId, this.foreignModel);

    return entryExist;
  }
}

/**
 * Doesn't Require
 */
export class SoftRef {
  dbType = "B";
  /**
   * @param {Model} foreigner - reference to an instance of a foreign model
   * @param {String} connection - property being used for connecting the models
   */
  constructor(foreigner, validate = true) {
    if (validate) {
      this.foreignModel = foreigner;
      this.foreignKey = foreigner.pK;
      this.locked = false;
      if (_.isNil(this.foreignModel)) {
        throw new WebError(
          DATABASE_REJECTION,
          "No foriegn Model provided for Reference"
        );
      }
    }
  }

  async validator(refId) {
    if (_.isNil(this.foreignModel)) {
      throw new WebError(
        DATABASE_REJECTION,
        "No foriegn Model provided for Reference"
      );
    } else if (_.isNil(refId)) {
      throw new WebError("Foreign Model lacks identification for Reference");
    }
    let entryExist = await this.foreignModel.fn.get(refId);
    if (!this.locked && !_.isNil(entryExist)) {
      this.locked = true;
    } else if (this.locked) {
      checkDetection(entryExist, refId, this.foreignModel);
    }
    return result;
  }
}

export class Collection {
  dbType = "B";
  /**
   * @param {Model} foreigner - reference to an instance of a foreign model
   */
  constructor(foreigner, self) {
    // if (_.isNil(foreigner)) {
    //   throw new Error("No foriegn Model provided for Reference");
    // } else if (_.isNil(foreigner.primaryId)) {
    //   throw new Error("Foriegn Model lacks identification for Reference");
    //   // } else if (_.isNil(self)) {
    //   //   throw new Error("");
    // }
    // let type = foreigner.primaryId.type;
    // let id = foreigner.primaryId;
  }
  async validator(refId) {}
}
