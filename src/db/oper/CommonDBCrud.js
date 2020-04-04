import _ from "lodash";
import env, { DEVELOPMENT } from "../../config/env";
import { checkProps, executor, prepProps, dynamoDBFilterMarshalling, uniquenessCondition } from "./DatabaseValidations";
import { CLIENT_GENERIC } from "../../io/HttpErrors";
import { ON_CREATE, ON_UPDATE } from "../models/common/Attributes";

export const UPDATE = "update";
export const ITEM = "Item";
export const ATTRIBUTES = "Attributes";

/**
 * Updated
 */
export const create = Model => async Item => {
  Item = await prepProps(Model, Item, ON_CREATE);
  console.log(Model.modelName, Item);
  await checkProps(Model, Item, true);
  console.log(Model.modelName, Item);
  let uniqueClauses = uniquenessCondition(Model, Item);
  let params = { Item, ...uniqueClauses };
  return await executor(Model, "put", params);
};
/**
 * Create and Get
 * @param {*} Model
 */
export const record = Model => async Item => {
  await create(Model)(Item);
  return await get(Model)(_.get(Item, [Model.pK]));
};

export const crement = Model => async Item => {
  Item = await prepProps(Model, Item, ON_UPDATE);
  await checkProps(Model, Item);

  let params = { Item };
  return await executor(Model, UPDATE, params);
};
export const update = Model => async (keyValue, Item) => {
  Item = await prepProps(Model, Item, ON_UPDATE);
  await checkProps(Model, { [Model.pK]: keyValue, ...Item });

  let params = { Key: { [Model.pK]: keyValue }, Item };
  console.log(params);
  return await executor(Model, UPDATE, params);
};
export const createUpdate = Model => async (Key, Item) => {
  Item = await prepProps(Model, Item);
  await checkProps(Model, Item);

  let params = { Key, Item };
  let dbObj = await executor(Model, "get", params);
  if (!_.isNil(dbObj)) {
    params = _.omit(params, "Item.createdDate");
    return await executor(Model, UPDATE, params);
  } else {
    await checkProps(Model, Item, true);
    return await executor(Model, "put", { ...params, ReturnValues: "ALL_OLD" });
  }
};
export const remove = Model => async Item => {
  Item = await prepProps(Model, Item);
  await checkProps(Model, Item);

  let params = { Item };
  return await executor(Model, "delete", params);
};

/**
 * Select
 */
export const query = Model => async (Item, dynoExpression) => {
  let marshalling = { KeyConditionExpression: [], ExpressionAttributeValues: {} };
  for (let key in Item) {
    let value = Item[key];
    if (_.isArray(value)) {
      if (value.length === 2) {
        marshalling.KeyConditionExpression.push(key + " " + value[1] + " :" + _.camelCase(key));
        marshalling.ExpressionAttributeValues[":" + _.camelCase(key)] = value[0];
      } else {
        if (_.isNil(value[0])) {
          throw new WebError(CLIENT_GENERIC, "Value for query not provided with respect to key: " + key);
        }
        console.warn("Invalid use of query item value array. Defaulting to match value.");
        marshalling.KeyConditionExpression.push(key + " = :" + _.camelCase(key));
        marshalling.ExpressionAttributeValues[":" + _.camelCase(key)] = value[0];
      }
    } else {
      marshalling.KeyConditionExpression.push(key + " = :" + _.camelCase(key));
      marshalling.ExpressionAttributeValues[":" + _.camelCase(key)] = value;
    }
  }
  marshalling.KeyConditionExpression = marshalling.KeyConditionExpression.join(" and ");
  console.log("Marshalling: ", marshalling);
  let params = {
    // Key: {
    //   id: event.pathParameters.id,
    // },
    ...marshalling,
    ...dynoExpression,
  };

  return await executor(Model, "query", params);
};

export const get = Model => async (keyValue, dynoExpression = {}) => {
  let params = { Key: { [Model.pK]: keyValue }, ...dynoExpression };
  return await executor(Model, "get", params);
};

export const scan = Model => async (filterExpression = {}, dynoExpression = {}) => {
  let marshalledFilteredExpression = {};
  if (!_.isNil(filterExpression)) {
    marshalledFilteredExpression = dynamoDBFilterMarshalling(Model, filterExpression);
  }
  let dynamodbObject = _.merge(marshalledFilteredExpression, dynoExpression);
  return await executor(Model, "scan", dynamodbObject);
};

export default Model => {
  let functions = { get, query, create, record, crement, update, createUpdate, remove, scan };
  for (let func in functions) {
    functions[func] = functions[func](Model);
  }
  if (env.mode === DEVELOPMENT) {
    //Put methods that should be for Development only here
  }
  return functions;
};
