/**
 * The Entity ID of an object. This value can only be provided once,
 * and cannot be overriden.
 */
export type EntityId = string & { readonly brand: unique symbol };

/**
 * Represents a consistent valid timestamp format
 * used throughout the application.
 */
export type TimeStamp = string & { readonly brand: unique symbol };
