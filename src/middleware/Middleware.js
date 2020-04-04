import _ from "lodash";
import Policy from "./Policy";
import Session from "./Session";
import { SERVER_DEFAULT } from "../io/HttpErrors";

export const prep = async (event, context, endpoint) => {
  try {
    let result = { fails: 0, messages: [], ok: true };

    //Handle Sessions
    if (endpoint.session) {
      result.session = await Session.handleSession(event);
      if (!_.isNil(result.session.status) && !result.session.status) {
        result.fails++;
      }
      if (!_.isNil(result.session.message)) {
        result.messages.push(result.session.message);
      }
    }

    //Handle Policies
    if (!_.isEmpty(endpoint.policy)) {
      result.policy = Policy.handlerPolicies(endpoint);
      if (!_.isNil(result.policy.status) && !result.policy.status) {
        result.fails++;
      }
      if (!_.isNil(result.policy.message)) {
        result.messages.push(result.policy.message);
      }
    }

    //Dynamic Path Validation
    if (!_.isEmpty(endpoint.dynamicPath)) {
      let hasAllDynPath = _.every(endpoint.dynamicPath, path => event.pathParameters.includes(path));
      if (!hasAllDynPath) {
        result.fails++;
        result.messages.push("Dynamic URL Path(s) Not Provided");
      }
    }

    //Handle Schema
    if (!_.isNil(endpoint.request) && !endpoint.request(event).valid) {
      result.fails++;
      result.messages.push("Validation Failure");
    }

    result.ok = result.fails === 0;
    return result;
  } catch (error) {
    console.log("Error Being Catched", error);

    return { fails: 1, error: error.message, ok: false, errorCode: SERVER_DEFAULT };
  }
};

export default { prep };
