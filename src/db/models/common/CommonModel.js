import CommonDBCrud from "../../oper/CommonDBCrud";
import CommonAttributes from "./Attributes";

export default class CommonModel {
  constructor(name) {
    this.pK = "id";
    this.modelName = name;
    this.properties = CommonAttributes;
    this.fn = CommonDBCrud(this);
  }
  /**@interface*/
  init() {}
}
