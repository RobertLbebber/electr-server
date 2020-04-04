import Attributes, { TYPES, createRef, required } from "./common/Attributes";
import env from "../../config/env";
import CommonDBCrud from "../oper/CommonDBCrud";
import SingletonGenerator from "../../endpoints/_common/SingletonGenerator";
import AccountSingleton from "./Account.json.js";
import CommonDoc from "./common/CommonDoc";

const TableName = "AccountPages";

class Model {
  constructor() {
    this.pK = "id";
    this.properties = {
      ...Attributes,
      serial: { type: TYPES.STRING },
      designName: { type: TYPES.STRING },
      designCategory: { type: TYPES.STRING },
      pageContent: { type: TYPES.OBJECT, ...required }
    };
    this.fn = CommonDBCrud(this, TableName);
  }
  init() {
    this.properties.accountId = createRef(AccountSingleton.getInstance());
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
// updateOrCreate: function(criteria, values) {
//   var self = this; // reference for use by callbacks
//   // If no values were specified, use criteria
//   if (!values) values = criteria.where ? criteria.where : criteria;

//   return this.findOne(criteria).then(async function(result) {
//     if (result) {
//       let response = await self.update(criteria, values).fetch();
//       return {
//         wasCreated: false,
//         response: response
//       };
//     } else {
//       let response = await self.create(values).fetch();
//       return { wasCreated: true, response: response };
//     }
//   });
// },

// createDefaultTemplate: async function(accountId) {
//   if (globals.dev.dev_mode) {
//     sails.log("Dropping Default Template For Replacement");
//   }
//   await this.destroy({ designName: "Default" });
//   await this.create({
//     designName: "Default",
//     designCategory: "Basic",
//     pageLayout: content,
//     accountId: accountId ? accountId : null
//   });
// },

// getDefaultTemplate: async function() {
//   return await this.find({ designName: "Default" }).limit(1);
// },

const AccountPagesSingleton = new SingletonGenerator(Model);
export default AccountPagesSingleton;
export class AccountPagesDoc extends CommonDoc {
  constructor(identity) {
    super(Model, identity);
  }
}
