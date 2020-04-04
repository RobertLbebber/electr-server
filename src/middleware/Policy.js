import env from "../config/env";
import { DEVELOPMENT } from "../config/env";

export const handlePolicies = currentRule => {
  if (currentRule.debug && !env.mode === DEVELOPMENT) {
    return { message: "Functionallity is not permitted.", status: false };
  }
  return { status: true };
};

export default { handlePolicies };
