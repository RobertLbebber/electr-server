import AccountController from "./Account/AccountController";
import SessionsController from "./Sessions/SessionsController";
import DebugController from "./Debug/DebugController";
import PostController from "./Post/PostController";

export const paths = {
  AccountController: "Account/AccountController",
  SessionsController: "Sessions/SessionsController",
  PostController: "Post/PostController",
  DebugController: "DebugController",
};

export default { AccountController, DebugController, PostController, SessionsController };
