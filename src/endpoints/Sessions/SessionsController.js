import _ from "lodash";
import ResponseStatus from "../../io/ResponseStatus";
import GH from "../_common/GenerateHandler";
import { GenericController } from "../_common/GenericController";
import Requests from "./Requests";
import WebError, {
  INVALID_INPUT,
  UNPROCESSABLE_ENTITY,
  NOT_IMPLEMENTED,
  DATABASE_FAILURE,
  NOT_FOUND,
} from "../../io/HttpErrors";
import env, { DEVELOPMENT } from "../../config/env";
import AccountSingleton from "../../db/models/Account.json";
import SessionsSingleton from "../../db/models/Sessions.json.js";

class SessionsController extends GenericController {}

// const Account = AccountSingleton.getInstance();

let init = new SessionsController()

  //Creates a session for user
  .create("createSession")
  .post()
  .open()
  .path("session")
  .request(Requests.SESSION_CREATE)
  .fn(async (event, context, endpoint) => {
    const Sessions = SessionsSingleton.getInstance();
    let parameters = JSON.parse(event.body);
    if (env.mode === DEVELOPMENT) {
      // try {
      console.log("Hi");
      let existingSession = await Sessions.fn.createGet({
        id: parameters.formData.emailAddress,
        accountId: "1",
      });
      if (!_.isNil(existingSession)) {
        return ResponseStatus();
      } else {
        return ResponseStatus(false, "Unable To Create Session", DATABASE_FAILURE);
      }
    } else {
      let existingAccount = await Account.fn.scan({
        email: parameters.formData.emailAddress,
        password: parameters.formData.password,
      });

      if (!_.isNil(existingAccount)) {
        let existingSession = await Sessions.fn.create({ accountId: existingAccount.id });
        if (!_.isNil(existingSession)) {
          return ResponseStatus();
        } else {
          return ResponseStatus(false, "Unable To Create Session", DATABASE_FAILURE);
        }
      } else {
        return ResponseStatus(false, "No Existing Account Found", NOT_FOUND);
      }
    }
  })

  //GET Check user's session
  .create("checkSession")
  .path("session")
  .open()
  .fn(async (event, context) => {
    throw new WebError();
    return ResponseStatus(false, middles, NOT_IMPLEMENTED);
  })

  //Destroy user's session
  .create("destroySession")
  .deleter()
  .path("session")
  .request(Requests.SESSION_DELETE)
  .fn(async (event, context) => {
    return ResponseStatus(false, middles, NOT_IMPLEMENTED);
  })

  //Check user's session
  .create("newUser")
  .put()
  .open()
  .path("session")
  .request(Requests.SESSION_NEW)
  .fn(async (event, context) => {
    let formData = _.get(JSON.parse(event.body), "formData");
    if (_.get(formData, "password") !== _.get(formData, "confirmation")) {
      return ResponseStatus(false, "Invalid Password Combination", INVALID_INPUT);
    }
    let accountModel = AccountGn(formData.fName, formData.lName, formData.emailAddress, formData.password);

    try {
      let crudResponse = await Account.fn.create(accountModel);
      console.log(crudResponse);
      return ResponseStatus(true, "Creation Completion");
    } catch (error) {
      return ResponseStatus(false, error.message, UNPROCESSABLE_ENTITY);
    }
  });

let endpoints = GH.expFn(init);
module.exports = { ...endpoints, SessionsController: init };
