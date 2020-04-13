import _ from "lodash";
import { JsonUtilities, DatabaseSchemas } from "electr-common";
import CommonDBCrud from "../../oper/CommonDBCrud";
import { Collection, StrictLink, LooseLinks } from "Types";
export default class CommonModel {
  constructor(schema, tableName) {
    this.pK = this.primaryKey = _.get(schema, "primaryKey", "id");
    this.modelName = this.tableName = tableName;
    this.schema = schema;
    this.fn = CommonDBCrud(this);
  }

  init(Singletons) {
    let collections = JsonUtilities.getObjects(this.schema, "type", "collection");
    let looseLinks = JsonUtilities.getObjects(this.schema, "type", "loose-link");
    let strictLinks = JsonUtilities.getObjects(this.schema, "type", "strict-link");
    _.each(collections, (collection) => {
      let ref = collection["$ref"];
      if (_.isNil(ref)) {
        throw new Error(`'${this.schema.table}' lacks suffieciant '$ref's for some Collections`);
      }
      let forienModal = Singletons[ref].getInstance();
      collection.link = new Collection(forienModal, this);
    });
    _.each(looseLinks, (looseLink) => {
      let ref = looseLinks["$ref"];
      if (_.isNil(ref)) {
        throw new Error(`'${this.schema.table}' lacks suffieciant '$ref's for some Loose Links`);
      }
      let schemaTableName = DatabaseSchemas[ref].table;
      let forienModal = Singletons[schemaTableName].getInstance();
      looseLink.link = new LooseLinks(forienModal, this);
    });
    _.each(strictLinks, (strictLink) => {
      let ref = strictLink["$ref"];
      if (_.isNil(ref)) {
        throw new Error(`'${this.schema.table}' lacks suffieciant '$ref's for some Strict Links`);
      }
      let forienModal = Singletons[ref].getInstance();
      strictLink.link = new StrictLink(forienModal, this);
    });
  }
}
