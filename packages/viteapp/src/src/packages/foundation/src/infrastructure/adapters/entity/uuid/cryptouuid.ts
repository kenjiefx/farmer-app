import { EntityId } from "../../../../types";

/**
 * Creates a new entity ID.
 * @returns A new UUID string to be used as an entity ID.
 */
export const uuidFactory = (): EntityId => {
  return crypto.randomUUID() as EntityId;
};
