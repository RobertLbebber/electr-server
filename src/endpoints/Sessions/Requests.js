export default {
  SESSION_CREATE: {
    id: "/createSession",
    type: "object",
    properties: {
      formData: {
        type: "object",
        emailAddress: { type: "string" },
        password: { type: "string" },
        rememberMe: { type: "boolean" },
      },
    },
    required: ["formData"],
  },
  SESSION_NEW: {
    type: "object",
    properties: {
      formData: {
        type: "object",
        firstName: { type: "string" },
        lastName: { type: "string" },
        emailAddress: { type: "string" },
        password: { type: "string" },
        confirmation: { type: "string" },
      },
    },
  },
  SESSION_DELETE: { id: "/destroySession", type: "object", properties: { sessionId: { type: "string" } } },
};
