let custom = {
  plugins: ["serverless-dynamodb-local", "serverless-offline"],
  custom: {
    dynamodb: {
      start: {
        port: 7000,
        // inMemory: false,
        migrate: true,
        // sharedDb: true,
      },
      migration: {
        dir: ".dynamodb",
      },
      "serverless-offline": {
        port: 4000,
      },
    },
  },
};

export default custom;
