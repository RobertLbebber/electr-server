import _ from "lodash";
import Middleware from "../../middleware/Middleware";
// import Account from "../db/models/Account.json.js";
import ResponseStatus from "../../io/ResponseStatus";
import GH from "../_common/GenerateHandler";
import { GenericController } from "../_common/GenericController";
import Requests from "./Requests";
import { CLIENT_UNKNOWN } from "../../io/HttpErrors";

class PostController extends GenericController {}

let init = new PostController()
  .create("createPost")
  .post()
  .path("post")
  .request(Requests.POST)
  .fn(async (event, context) => {
    let middles = await Middleware.prep(event, context, init);
    if (!middles.ok) {
      return ResponseStatus(false, middles, _.get(middles, "errorCode", CLIENT_UNKNOWN));
    }
    console.log(middles.ok, middles);
    return ResponseStatus(middles.ok, middles);
  })

  //
  .create("editPost")
  .post()
  .path("post/{postId}/edit")
  .dynamic(["postId"])
  .request(Requests.POST)
  .fn(async (event, context) => {
    let middles = await Middleware.prep(event, context, init);
    return ResponseStatus(middles.ok, middles);
  })

  //
  .create("getPost")
  .path("post/{postId}")
  .dynamic(["postId"])
  .fn(async (event, context) => {
    let middles = await Middleware.prep(event, context, init);
    return ResponseStatus(middles.ok, middles);
  })

  //
  .create("reactPost")
  .post()
  .path("post/{postId}/react")
  .dynamic(["postId"])
  .request(Requests.POST_REACT)
  .fn(async (event, context) => {
    let middles = await Middleware.prep(event, context, init);
    return ResponseStatus(middles.ok, middles);
  })

  //
  .create("donatePost")
  .post()
  .path("post/{postId}/donate")
  .dynamic(["postId"])
  .request(Requests.POST_DONATE)
  .fn(async (event, context) => {
    let middles = await Middleware.prep(event, context, init);
    return ResponseStatus(middles.ok, middles);
  })

  //
  .create("deletePost")
  .deleter()
  .path("post/{postId}")
  .dynamic(["postId"])
  .fn(async (event, context) => {
    let middles = await Middleware.prep(event, context, init);
    return ResponseStatus(middles.ok, middles);
  });

let endpoints = GH.expFn(init);
module.exports = { ...endpoints, PostController: init };
