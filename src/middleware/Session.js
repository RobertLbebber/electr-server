import Moment from "moment";
import _ from "lodash";

import SessionsSingleton, { Utils } from "../db/models/Sessions.json";
import { StatusObject } from "../io/ResponseStatus.js";

export const handleSession = async event => {
  let Sessions = SessionsSingleton.getInstance();
  let key;

  if (_.isNil(event.headers)) {
    return StatusObject(false, "No Headers found in the Event Object");
  } else if (_.isNil(event.headers.sessionId)) {
    return StatusObject(false, "No Session Id found in the Event Object");
  } else {
    key = event.headers.sessionId;
  }
  let resultSet = await Sessions.fn.get(key);
  if (_.isNil(resultSet.Item)) {
    return StatusObject(false, "No Session found with that key");
  } else if (!Utils.stillActive(resultSet.Item)) {
    return StatusObject(false, "No Session found with that key", 2);
  } else {
    //update the timestamp
    await Sessions.fn.update(key, { updatedDate: new Moment().format() });
    return StatusObject(true);
  }
};

export default { handleSession };
