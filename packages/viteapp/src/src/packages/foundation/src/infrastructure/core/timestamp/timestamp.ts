import { TimeStamp } from "../../../types.js";

/**
 * This module provides a flexible mechanism for managing
 * TimeStamps in the application. This allows different
 * implementations of TimeStamps to be used without tightly
 * coupling the codebase to a specific implementation.
 */

let timestampFactory: () => TimeStamp = () => {
  throw new Error("TimeStamp factory is not set");
};

let timestampAssertionFn: (
  value: unknown,
) => asserts value is TimeStamp = () => {
  throw new Error("TimeStamp assertion function is not set");
};

let timestampValidationFn: (value: string) => boolean = () => {
  throw new Error("TimeStamp validation function is not set");
};

let convertDateToTimestampFn: (value: Date) => TimeStamp = (value) => {
  throw new Error("TimeStamp normalization function is not set");
};

/**
 * Sets the factory function for creating TimeStamps.
 * @param factory A function that returns a new TimeStamp when called.
 */
export function setTimestampFactory(factory: () => TimeStamp) {
  timestampFactory = factory;
}

/**
 * Creates a new TimeStamp using the configured factory function.
 * @returns A new TimeStamp.
 * @throws An error if the TimeStamp factory function is not set.
 */
export function getTimestampNow(): TimeStamp {
  return timestampFactory();
}

/**
 * Sets the assertion function for validating TimeStamps.
 * @param assertionFn A function that asserts a value is a valid TimeStamp.
 * @throws An error if the TimeStamp assertion function is not set.
 */
export function setTimestampAssertionFn(
  assertionFn: (value: unknown) => asserts value is TimeStamp,
) {
  timestampAssertionFn = assertionFn;
}

/**
 * Asserts that the provided value is a valid TimeStamp using the configured assertion function.
 * @param value The value to validate as a TimeStamp.
 * @throws An error if the value is not a valid TimeStamp.
 */
export function assertIsValidTimestamp(
  value: unknown,
): asserts value is TimeStamp {
  timestampAssertionFn(value);
}

/**
 * Sets the validation function for checking if a value is a valid TimeStamp.
 * @param validationFn A function that validates whether a value is a valid TimeStamp.
 * @throws An error if the TimeStamp validation function is not set.
 */
export function setTimestampValidationFn(
  validationFn: (value: string) => boolean,
) {
  timestampValidationFn = validationFn;
}

/**
 * Validates whether a value is a valid TimeStamp using the configured validation function.
 * @param value The value to validate as a TimeStamp.
 * @return True if the value is a valid TimeStamp, false otherwise.
 * @throws An error if the TimeStamp validation function is not set.
 */
export function isValidTimestamp(value: string): boolean {
  return timestampValidationFn(value);
}

/**
 * Sets the function for converting Date objects to TimeStamps.
 * @param convertFn A function that converts a Date to a TimeStamp.
 * @throws An error if the TimeStamp normalization function is not set.
 */
export function setConvertDateToTimestampFn(
  convertFn: (value: Date) => TimeStamp,
) {
  convertDateToTimestampFn = convertFn;
}

/**
 * Converts a Date object to a TimeStamp using the configured conversion function.
 * @param date The Date object to convert.
 * @return The corresponding TimeStamp.
 * @throws An error if the TimeStamp normalization function is not set.
 */
export function convertDateToTimestamp(date: Date): TimeStamp {
  return convertDateToTimestampFn(date);
}
