import env from "../../config/env";
import {
  TYPES,
  required,
  unique,
  createRef,
  createCollection,
  encrypted
} from "./common/Attributes";
import SingletonGenerator from "../../endpoints/_common/SingletonGenerator";
import EmailAccountSingleton from "./EmailAccount.json";
import CommonModel from "./common/CommonModel";
import CommonDoc from "./common/CommonDoc";

const TableName = "Account";

export const AccountGn = (firstName, lastName, primaryEmail, password) => ({
  firstName,
  lastName,
  primaryEmail,
  password
});

class Model extends CommonModel {
  constructor() {
    super(TableName);
    this.properties = {
      ...this.properties,
      //Required
      password: { type: TYPES.STRING, required, encrypted },
      firstName: { type: TYPES.STRING, required },
      lastName: { type: TYPES.STRING, required },

      //Options
      profileImg: { type: TYPES.STRING },
      messages: { collection: "messages", via: "accountId" },
      creditCard: { collection: "creditCards", via: "accountId" }
    };
  }

  init() {
    //Connections
    this.properties.primaryEmail = createRef(
      EmailAccountSingleton.getInstance(),
      { required, unique }
    );
    this.properties.emails = createCollection(
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

const AccountSingleton = new SingletonGenerator(Model);
export default AccountSingleton;
export class AccountDoc extends CommonDoc {
  constructor(identity) {
    super(AccountSingleton.getInstance(), identity);
  }
}
