import _ from "lodash";
import Models from "../db/models/_export.json";
let db = {
  resources: {
    Resources: Models
  }
};

export default db;
