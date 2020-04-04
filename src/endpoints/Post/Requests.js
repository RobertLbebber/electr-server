export default {
  POST: {
    id: "/Post",
    type: "object",
    properties: {
      formData: {
        title: { type: "string" },
        subtitle: { type: "string" },
        attachments: { type: "string" },
      },
    },
    // required: ["formData"],
  },

  POST_REACT: {
    id: "/postReact",
    type: "object",
    properties: {
      reactionData: {
        type: "object",
      },
    },
    required: ["reactionData"],
  },

  POST_DONATE: {
    id: "/postDonate",
    type: "object",
    properties: {
      donateAmount: { type: "number" },
      paymentData: { type: "object" },
    },
    required: ["donateData", "paymentData"],
  },
};
