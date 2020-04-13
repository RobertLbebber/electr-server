import { DatabaseSchemas } from "electr-common";
import _ from "lodash";
// import { Singletons } from "_export.json";
import DynamoDefaultStruct from "../table-formats/default";
import CommonModel from "./common/CommonModel";
import CommonDoc from "./common/CommonDoc";
import GenerateSingleton from "endpoints/_common/GenerateSingleton";

let TablesDocs = {};
let Singletons = {};
let DynaTables = {};

function geTableName(tableName, altName) {
  if (_.isNil(tableName)) {
    console.warn("Attempted to create table without 'table' field  being populated, resorting to" + "'id' instead.");
    tableName = altName;
    if (_.isNil(tableName)) {
      console.warn("Neither '$id' nor 'table' are populated, table will not be generated");
      return;
    }
  }
  return tableName;
}

//Create Model
_.each(DatabaseSchemas, (schema) => {
  let tableName = geTableName(schema.table, schema["$id"]);
  if (_.isNil(tableName)) {
    return;
  }

  let Model = class extends CommonModel {
    constructor() {
      super(schema, tableName);
    }
    init() {}
  };
  Singletons[tableName] = new GenerateSingleton(Model);

  //Create Table
  let primarykey;
  if (_.isNil(schema.primaryKey)) {
    console.debug("No 'primaryKey' given using (id) as default");
    primarykey = "id";
  } else {
    primarykey = schema.primaryKey;
  }
  DynaTables[tableName] = DynamoDefaultStruct(tableName, primarykey);
});

//Create and Lock Singletons
_.each(Singletons, (Singleton) => Singleton.createInstance());
_.each(Singletons, (Singleton) => Singleton.sealInstance());

//Create Doc
_.each(Singletons, (Singleton) => {
  let SingletonInstance = Singleton.getInstance();
  let tableName = Singleton.Model.tableName;
  TablesDocs[tableName] = class extends CommonDoc {
    constructor(identity) {
      super(SingletonInstance, identity);
    }
  };
});

export const SingletonList = Singletons;
export const Tables = DynaTables;
export default TablesDocs;
