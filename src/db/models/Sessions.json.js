import Moment from "moment";

import { createRef } from "./common/Attributes";
import env from "../../config/env";
import SingletonGenerator from "../../endpoints/_common/SingletonGenerator";
import AccountSingleton from "./Account.json";
import CommonModel from "./common/CommonModel";
import EmailAccountSingleton from "./EmailAccount.json";
import CommonDoc from "./common/CommonDoc";

const TableName = "Sessions";

export const Utils = {
  stillActive: dataResult => {
    let then = new Moment(dataResult.updatedDate);
    return then.isBetween(
      new Moment().subtract(10, "minute"),
      new Moment().add(10, "minute")
    );
  }
};

class Model extends CommonModel {
  constructor() {
    super(TableName);
    /**
     * Primary Key is "id"
     */
  }
  /** @override*/
  init() {
    this.properties.accountId = createRef(AccountSingleton.getInstance());
    this.properties.emailAccountId = createRef(
      EmailAccountSingleton.getInstance()
    );
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

const SessionsSingleton = new SingletonGenerator(Model);
export default SessionsSingleton;
export class SessionsDoc extends CommonDoc {
  constructor(identity) {
    super(SessionsSingleton.getInstance(), identity);
  }
}
