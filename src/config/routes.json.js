import Controllers, { paths } from "../endpoints/_export";
import _ from "lodash";

function routeBuilder() {
  let functions = {};
  for (let controllerName in Controllers) {
    let controller = Controllers[controllerName]; //Double Nested
    for (let handlerName in controller[controllerName].endpoints) {
      let handlerGroup = controller[controllerName].endpoints[handlerName];
      if (handlerGroup.constructor != Object) {
        continue;
      }
      let handlerPathName = controllerName + "-" + handlerName;
      functions[handlerPathName] = {
        handler: "dist/endpoints/" + paths[controllerName] + "." + handlerName,
      };
      let http = {
        path: handlerGroup.path,
        method: _.toLower(handlerGroup.rest),
      };
      for (let key in http) {
        if (_.isNil(http[key])) {
          delete http[key];
        }
      }
      if (!_.isEmpty(http)) {
        //http.//cors = true;
        functions[handlerPathName].events = [{ http }];
      }
    }
  }
  return functions;
}

let routes = {
  functions: routeBuilder(),
};
export default routes;
