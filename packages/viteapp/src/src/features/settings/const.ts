export const USER_PERMISSIONS = [
  {
    collection: "observation",
    value: "observation:create",
    description: "Create a new observation",
  },
  {
    value: "observation:read",
    collection: "observation",
    description: "Read an observation",
  },
  {
    value: "observation:update",
    collection: "observation",
    description: "Update an observation",
  },
  {
    value: "observation:delete",
    collection: "observation",
    description: "Delete an observation",
  },
  {
    collection: "settings",
    value: "settings:read",
    description: "Read the settings",
  },
  {
    collection: "settings",
    value: "settings:update",
    description: "Update the settings",
  },
  {
    collection: "users",
    value: "user:read",
    description: "Read the user",
  },
  {
    collection: "users",
    value: "user:update",
    description: "Update the user",
  },
  {
    collection: "users",
    value: "user:delete",
    description: "Delete the user",
  },
  {
    collection: "users",
    value: "user:create",
    description: "Create a new user",
  },
];
