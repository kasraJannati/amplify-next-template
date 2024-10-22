/**
 * Formats a Date object to a string in YYYY-MM-DD format.
 * @param date - The Date object to format.
 * @returns A string representing the date in YYYY-MM-DD format, or null if the date is null.
 */
export const formatDate = (date: Date | null): string | null => {
  return date ? date.toISOString().split("T")[0] : null;
};

/**
 * Converts a date string in YYYY-MM-DD format to a full Date string with time and time zone information.
 * @param dateString - The date string to convert (must be in YYYY-MM-DD format).
 * @returns A string representing the full local date and time, including time zone information.
 */
export const convertToFullDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript
  return date; // Returns the full local date string
};
