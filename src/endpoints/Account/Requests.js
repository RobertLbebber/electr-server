export default {
  ACCOUNT_CREATE: {
    id: "/createAccount",
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      emailAddress: { type: "string" },
      password: { type: "string" },
      confirmation: { type: "string" },
    },
    required: ["firstName", "lastName", "emailAddress", "password", "confirmation"],
  },
  ACCOUNT_DELETE: {
    id: "/destroyAccount",
    type: "object",
    properties: {
      emailAddress: { type: "string" },
      password: { type: "string" },
    },
    required: ["emailAddress", "password"],
  },
};
