// import { DatabaseSchemas } from "electr-common";
// import env from "../../config/env";
// // import {
// //   TYPES,
// //   required,
// //   unique,
// //   createRef,
// //   createCollection,
// //   encrypted
// // } from "./common/Attributes";
// import SingletonGenerator from "../../endpoints/_common/GenerateSingleton";
// // import EmailAccountSingleton from "./EmailAccount.json";
// import CommonModel from "./common/GenerateModel";
// import CommonDoc from "./common/CommonDoc";

// // const AccountDBON = DatabaseSchemas.AccountDBON;
// const TableName = "Account";

export const AccountGn = (firstName, lastName, primaryEmail, password) => ({
  firstName,
  lastName,
  primaryEmail,
  password,
});

// class Model extends CommonModel {
//   constructor() {
//     super(TableName);
//   }
// }

// export const Table = {
//   Type: env.mainDB,
//   DeletionPolicy: env.deletionPolicy,
//   Properties: {
//     TableName: env.tableName(TableName),
//     KeySchema: [
//       {
//         AttributeName: "id",
//         KeyType: "HASH",
//       },
//     ],
//     AttributeDefinitions: [
//       {
//         AttributeName: "id",
//         AttributeType: "S",
//       },
//     ],
//     ProvisionedThroughput: {
//       ReadCapacityUnits: 1,
//       WriteCapacityUnits: 1,
//     },
//   },
// };

// export default AccountSingleton;
// export class AccountDoc extends CommonDoc {
//   constructor(identity) {
//     super(AccountSingleton.getInstance(), identity);
//   }
// }
