import Attributes, { createRef, required, unique } from "./common/Attributes";
import env from "../../config/env";
import CommonDBCrud from "../oper/CommonDBCrud";
import { TYPES } from "./common/Attributes";
import SingletonGenerator from "../../endpoints/_common/SingletonGenerator";
import AccountSingleton from "./Account.json";
import CommonDoc from "./common/CommonDoc";

const TableName = "Messages";

class Model {
  constructor() {
    this.pK = "id";
    this.properties = {
      ...Attributes,
      mainMessage: { type: TYPES.STRING },
      extraMessage: { type: TYPES.STRING },
      likes: { type: TYPES.NUMBER },
      shares: { type: TYPES.NUMBER }
    };
    this.fn = CommonDBCrud(this, TableName);
  }
  init() {
    this.properties.accountID = createRef(AccountSingleton.getInstance(), {
      required,
      unique
    });
  }
}

export const Table = {
  Type: env.mainDB,
  DeletionPolicy: env.deletionPolicy,
  Properties: {
    TableName: env.tableName(TableName),
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH"
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }
};
// /**
//  * Increment or Decrement the an action of the message
//  * @param {Boolean} incDec -
//  * @param {String} action -
//  * TODO @-param User ID
//  */
// crementAction: async function(incDec, action = "likes") {
//   this.update({ [action]: incDec ? 1 : -1 });
// },

const MessagesSingleton = new SingletonGenerator(Model);
export default MessagesSingleton;
export class MessagesDoc extends CommonDoc {
  constructor(identity) {
    super(Model, identity);
  }
}
