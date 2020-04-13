import _ from "lodash";

import { ApiCatalog } from "electr-common";
const Account = ApiCatalog.Categories.Account;

import ResponseStatus from "../../io/ResponseStatus";
import GH from "../_common/GenerateHandler";
import { GenericController } from "../_common/GenericController";
import Requests from "./Requests";
import AccountSingleton, {
  AccountGn,
  AccountDoc,
} from "../../db/models/Account.json";
import { EmailAccountDoc } from "../../db/models/EmailAccount.json";
import { SessionsDoc } from "../../db/models/Sessions.json";
import { NOT_IMPLEMENTED, FORBIDDEN } from "io/HttpErrors";

class AccountController extends GenericController {}

let init = new AccountController()
  .create("getMe")
  .path(Account.GET_ME)
  .fn(async (event, context, endpoint, globals) => {
    return ResponseStatus(true);
  })

  //
  .create("getAccountPage")
  .path(Account.GET_ID_PAGE)
  .fn(async (event, context, endpoint) => {
    return ResponseStatus(false, { event, context }, NOT_IMPLEMENTED);
  })

  //
  .create("setAccountPage")
  .path(Account.POST_ID_PAGE)
  .post()
  .fn(async (event, context) => {
    return ResponseStatus(false, { event, context }, NOT_IMPLEMENTED);
  })

  //
  .create("getFeed")
  .path("feed/")
  .fn(async (event, context) => {
    return ResponseStatus(false, { event, context }, NOT_IMPLEMENTED);
  })

  //
  .create("createDefaultAccount")
  .path("account/default")
  .fn(async (event, context) => {
    return ResponseStatus(false, { event, context }, NOT_IMPLEMENTED);
  })

  //
  .create("addAccount")
  .path(Account.POST_NEW)
  .post()
  .open()
  .request(Requests.ACCOUNT_CREATE)
  .fn(async ({ body }) => {
    let parameters = JSON.parse(body);
    if (
      _.get(parameters, "password", undefined) !==
      _.get(parameters, "confirmation", null)
    ) {
      return ResponseStatus(false, "Password Pair didn't match", FORBIDDEN);
    }
    const emailDoc = await new EmailAccountDoc(
      _.get(parameters, "emailAddress")
    ).record();
    let primaryEmail = _.get(emailDoc, "Item.email");
    const accountAct = new AccountDoc(
      AccountGn(
        parameters.firstName,
        parameters.lastName,
        primaryEmail,
        parameters.password
      )
    );
    let accountDoc = await accountAct.record();
    const sessionAct = await new SessionsDoc({
      accountId: _.get(accountDoc, "Item.id"),
      emailAccountId: primaryEmail,
    });
    let sessionDoc = await sessionAct.record();

    if (_.has(sessionDoc, "Item.id")) {
      return ResponseStatus(true, { session: _.get(sessionDoc, "Item.id") });
    } else {
      return ResponseStatus(false);
    }
  })

  //
  .create("getAll")
  .path(Account.GET_ALL)
  .debug()
  .open()
  .fn(async (event, context) => {
    const Account = AccountSingleton.getInstance();
    let result = await Account.fn.scan();
    return ResponseStatus(true, result);
  })

  //
  .create("runQuery")
  .post()
  .debug()
  .open()
  .fn(async ({ body }, context) => {
    const Account = AccountSingleton.getInstance();
    let parameters = JSON.parse(body);
    let result = await Account.fn.query(_.get(parameters, "query"));
    return ResponseStatus(true, { ...result.response });
  });

let endpoints = GH.expFn(init);
module.exports = { ...endpoints, AccountController: init };
