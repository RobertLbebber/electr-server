// const DYNAMODB_TABLE= ${self:service}-${opt:stage, self:provider.stage}

let provider = {
  provider: {
    name: "aws",
    runtime: "nodejs8.10",
    region: "us-east-1",
    stage: "dev",
    environment: {
      DYNAMODB_TABLE: "${self:service}-${opt:stage, self:provider.stage}"
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/*"
      }
    ]
  }
};

export default provider;
