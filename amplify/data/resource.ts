import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Project: a
    .model({
      title: a.string(),
      numberOfTasks: a.integer(),
      completionStatus: a.string(), // e.g., "In Progress", "Completed"
    })
    .authorization((allow) => [allow.owner()]), // Authorize only the project owner
  // .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // defaultAuthorizationMode: "apiKey",  // Important: API Key is used for allow.publicApiKey() rules
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
