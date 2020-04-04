import fs from "graceful-fs";
import { dump } from "node-yaml";
import routes from "./src/config/routes.json.js";
import server from "./src/config/server.json.js";
import db from "./src/config/db.json.js";
import custom from "./src/config/custom.json.js";
import provider from "./src/config/provider.json.js";

let full = {
  ...server,
  ...custom,
  ...routes,
  ...provider,
  ...db
};

const target = "serverless.yml";
const verbose = false;

async function appender(jsonYaml, name) {
  await new Promise(resolve =>
    fs.appendFile(target, JSON.stringify(), async function(err) {
      if (err) throw err;
      if (verbose) {
        console.log(name + " Saved!");
      }
      resolve();
    })
  );
}

async function runner() {
  //Creating Server Section
  let data = dump(full);
  await new Promise(resolve =>
    fs.writeFile(target, data, err => {
      if (err) throw err;
      if (verbose) {
        console.log("The file has been created!");
      }
      resolve();
    })
  );

  if (verbose) {
    console.log("The file has been completed!");
  }
}
runner();
