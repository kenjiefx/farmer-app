import { TimeStamp } from "../../../../types.js";

const validRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * Returns the current timestamp in UTC
 * @returns {string} The current timestamp in the format "YYYY-MM-DD HH:mm:ss"
 */
export const YYYMMDDHHmmssFactory = () => {
  const current = Date.now();
  return YYYMMDDHHmmssNormalizer(new Date(current));
};

/**
 * Checks if a timestamp is valid
 * @param date The timestamp to check
 * @returns {boolean} True if the timestamp is valid, false otherwise
 */
export const validateYYYYMMDDHHmmss = (date: string) => {
  if (!validRegex.test(date)) {
    return false;
  }
  const newdate = date.replace(" ", "T") + ".000Z";
  const dateobj = new Date(newdate);
  const normalized = YYYMMDDHHmmssNormalizer(dateobj);
  return !isNaN(dateobj.getTime()) && normalized === date;
};

/**
 * Normalizes a timestamp to the format "YYYY-MM-DD HH:mm:ss"
 * @param date The timestamp to normalize
 * @returns {string} The normalized timestamp
 */
export const YYYMMDDHHmmssNormalizer = (date: Date): TimeStamp => {
  const Y = date.getUTCFullYear();
  const MM = pad(date.getUTCMonth() + 1);
  const DD = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const mi = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${Y}-${MM}-${DD} ${hh}:${mi}:${ss}` as TimeStamp;
};

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Asserts that a value is a valid Timestamp branded
 * type of this module.
 * @param timestamp
 */
export function YYYMMDDHHmmssAssertFn(
  timestamp: unknown,
): asserts timestamp is TimeStamp {
  if (typeof timestamp !== "string") {
    throw new Error(`Timestamp must be a string`);
  }
  if (!validateYYYYMMDDHHmmss(timestamp)) {
    throw new Error(`Timestamp is not valid`);
  }
}
