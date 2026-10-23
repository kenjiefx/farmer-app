import { EntityId } from "../../../../types.js";

/**
 * Asserts that the provided ID is a valid UUID string.
 * @param id - The entity ID to validate.
 * @throws Will throw an error if the ID is not a valid UUID string.
 */
export function uuidAssertFn(id: unknown): asserts id is EntityId {
  if (!uuidValidator(id)) {
    throw new TypeError(`Entity ID must be in the valid UUID format`);
  }
}

/**
 * Checks if the provided ID is a valid UUID string.
 * @param id
 * @returns True if the ID is a valid UUID string, false otherwise.
 */
export function uuidValidator(id: unknown): id is EntityId {
  if (typeof id !== "string" || id.length !== 36) {
    return false;
  }
  // Hyphen checks (at fixed positions for UUID v4 format)
  if (id[8] !== "-" || id[13] !== "-" || id[18] !== "-" || id[23] !== "-") {
    return false;
  }
  // Validate hex chars (0-9, a-f) in all non-hyphen positions
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) continue;
    const c = id.charCodeAt(i);
    // '0'-'9' (48–57) or 'a'-'f' (97–102)
    if (!((c >= 48 && c <= 57) || (c >= 97 && c <= 102))) {
      return false;
    }
  }
  return true;
}
