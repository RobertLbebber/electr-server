import _ from "lodash";
import env from "../../config/env";
import { TYPES, required, unique, createSoftRef } from "./common/Attributes";
import AccountSingleton from "./Account.json";
import SingletonGenerator from "../../endpoints/_common/SingletonGenerator";
import CommonModel from "./common/CommonModel";
import CommonDoc from "./common/CommonDoc";

const TableName = "EmailAccount";

class Model extends CommonModel {
  constructor() {
    super(TableName);
    this.pK = "email";
    this.properties = _.omit(this.properties, "id");
    this.properties = {
      ...this.properties,
      email: { type: TYPES.STRING, required, unique }
      /**
       * Connections
       * @property {SoftRef} accountId-
       */
    };
  }

  init() {
    this.properties.accountID = createSoftRef(AccountSingleton.getInstance(), {
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
        AttributeName: "email",
        KeyType: "HASH"
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: "email",
        AttributeType: "S"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }
};

const EmailAccountSingleton = new SingletonGenerator(Model);
export default EmailAccountSingleton;
export class EmailAccountDoc extends CommonDoc {
  constructor(identity) {
    super(EmailAccountSingleton.getInstance(), identity);
  }
}
