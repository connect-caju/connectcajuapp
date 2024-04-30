export const containsNonNumeric = (value: any) => {
  // The regex \D is a shorthand character class that
  // matches any character that is not a digit [0-9]
  return /\D/.test(value);
}
