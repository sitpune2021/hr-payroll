/**
 * Validate a contact number.
 * E.g. allows 10-digit Indian mobile numbers.
 * Adjust pattern as needed.
 */
export const isValidContact = (value: string): boolean => {
  const pattern = /^[6-9]\d{9}$/;
  return pattern.test(value);
};

/**
 * Validate an email address.
 */
export const isValidEmail = (value: string): boolean => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value);
};

/**
 * Validate a name (alphabets + spaces only).
 */
export const isValidName = (value: string): boolean => {
  const pattern = /^[A-Za-z\s]+$/;
  return pattern.test(value);
};

/**
 * Validate an integer (positive or negative).
 */
export const isValidInteger = (value: string): boolean => {
  const pattern = /^-?\d+$/;
  return pattern.test(value);
};

/**
 * Validate any value against a custom regex.
 * @param value - the input value
 * @param regex - the regex pattern (RegExp or string)
 */
export const isValidByRegex = (value: string, regex: RegExp | string): boolean => {
  const pattern = regex instanceof RegExp ? regex : new RegExp(regex);
  return pattern.test(value);
};
