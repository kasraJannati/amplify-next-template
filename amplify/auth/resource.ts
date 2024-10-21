import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // Add attributes
  userAttributes: {
    preferredUsername: {
      mutable: true, // It's changeable
      required: false,
    },
    // email: {
    //   mutable: true,
    //   required: true,
    // },
  },
});
