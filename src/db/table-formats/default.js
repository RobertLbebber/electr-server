import env from "../../config/env";

export default function gen(TableName, AttributeName = "id", KeyType = "HASH", AttributeType = "S") {
  return {
    Type: env.mainDB,
    DeletionPolicy: env.deletionPolicy,
    Properties: {
      TableName: env.tableName(TableName),
      KeySchema: [{ AttributeName, KeyType }],
      AttributeDefinitions: [{ AttributeName, AttributeType }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  };
}
