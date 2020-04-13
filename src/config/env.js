import _ from "lodash";
import server from "./server.json.js";
import provider from "./provider.json.js";

export const DEVELOPMENT = "dev";
export const PRODUCTION = "prod";
export const DYNAMODB = "AWS::DynamoDB::Table";
export const DELETION_POLICY = "Delete";
export const SERVICE_NAME = "electr-rest";

let mode = DEVELOPMENT;
export const REGION =
  mode === PRODUCTION ? _.get(provider, "region", "localhost") : "localhost";
export const DATABASE_PORT = "8000";
export const DOMAIN =
  mode === PRODUCTION ? "TBD" : `http://${REGION}:${DATABASE_PORT}`;

export default {
  mode,
  mainDB: DYNAMODB,
  service: SERVICE_NAME,
  deletionPolicy: DELETION_POLICY,
  tableName: (table) => {
    return server.service + "-" + provider.provider.region + "-" + table;
  },
};
