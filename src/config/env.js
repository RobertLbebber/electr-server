import server from "./server.json.js";
import provider from "./provider.json.js";

export const DEVELOPMENT = "dev";
export const PRODUCTION = "prod";
export const DYNAMODB = "AWS::DynamoDB::Table";
export const DELETION_POLICY = "Delete";
export const SERVICE_NAME = "electr-rest";

export default {
  mode: DEVELOPMENT,
  mainDB: DYNAMODB,
  service: SERVICE_NAME,
  deletionPolicy: DELETION_POLICY,
  tableName: table => {
    return server.service + "-" + provider.provider.region + "-" + table;
  },
};
