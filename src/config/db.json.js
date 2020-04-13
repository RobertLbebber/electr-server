import _ from "lodash";
import { Tables } from "../db/models/GenerateTables";
let db = {
  resources: {
    Resources: Tables,
  },
};

export default db;
