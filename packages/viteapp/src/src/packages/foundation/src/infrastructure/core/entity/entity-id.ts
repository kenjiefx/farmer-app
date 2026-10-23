import { EntityId } from "../../../types.js";

/**
 * This module provides a flexible mechanism for managing
 * Entity IDs in the application. This allows different
 * implementations of Entity IDs to be used without tightly
 * coupling the codebase to a specific implementation.
 */

let entityIdFactory: () => EntityId = () => {
  throw new Error("EntityId factory is not set");
};

let entityIdAssertionFn: (value: unknown) => asserts value is EntityId = () => {
  throw new Error("EntityId assertion function is not set");
};

let entityIdValidationFn: (value: unknown) => boolean = () => {
  throw new Error("EntityId validation function is not set");
};

/**
 * Sets the factory function for creating Entity IDs.
 * @param factory A function that returns a new EntityId when called.
 */
export function setEntityIdFactory(factory: () => EntityId) {
  entityIdFactory = factory;
}

/**
 * Creates a new Entity ID using the configured factory function.
 * @returns A new EntityId.
 */
export function createEntityId(): EntityId {
  return entityIdFactory();
}

/**
 * Sets the assertion function for validating Entity IDs.
 * @param assertionFn A function that asserts a value is a valid EntityId.
 */
export function setEntityIdAssertionFn(
  assertionFn: (value: unknown) => asserts value is EntityId,
) {
  entityIdAssertionFn = assertionFn;
}

/**
 * Asserts that the provided value is a valid Entity ID using the configured assertion function.
 * @param value The value to validate as an EntityId.
 * @throws An error if the value is not a valid EntityId.
 */
export function assertValidEntityId(value: unknown): asserts value is EntityId {
  entityIdAssertionFn(value);
}

/**
 * Sets the validation function for checking if a value is a valid Entity ID.
 * @param validationFn  A function that validates whether a value is a valid EntityId.
 */
export function setEntityIdValidationFn(
  validationFn: (value: unknown) => boolean,
) {
  entityIdValidationFn = validationFn;
}

/**
 * Validates whether the provided value is a valid Entity ID
 * using the configured validation function.
 * @param value The value to validate as an EntityId.
 * @returns True if the value is a valid EntityId, false otherwise.
 */
export function isValidEntityId(value: unknown): boolean {
  return entityIdValidationFn(value);
}
