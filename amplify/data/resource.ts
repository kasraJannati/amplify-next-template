import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Project: a
    .model({
      title: a.string(),
      numberOfTasks: a.integer(),
      completionStatus: a.string(), // e.g., "Not Started", "In Progress", "Completed"
      tasks: a.hasMany("Task", "projectID"), // A project can have many tasks; tasks reference `projectID`
    })
    .authorization((allow) => [allow.owner()]), // Authorize only the project owner
  // .authorization((allow) => [allow.publicApiKey()]),

  Task: a
    .model({
      title: a.string(),
      description: a.string(),
      dueDate: a.date(),
      priority: a.string(), // e.g., "High", "Medium", "Low"
      status: a.string(), // e.g., "Not Started", "In Progress", "Completed"
      // Each task belongs to a project, identified by `projectID`
      projectID: a.id(), // Reference field for project ID
      project: a.belongsTo("Project", "projectID"), // Belongs to a single project
    })
    .authorization((allow) => [allow.owner()]), // Authorize only the task owner
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
