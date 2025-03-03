export const isSlotExpired = (slot) => {
  try {
    // Parse date components from MM/dd/yyyy format
    const [month, day, year] = slot.date.split("/").map(Number);

    // Parse time components from h:mm a format
    const timeMatch = slot.to.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!timeMatch) return true; // Invalid time format

    let [, hours, minutes, period] = timeMatch;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert to 24-hour format
    if (period?.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (period?.toUpperCase() === "AM" && hours === 12) hours = 0;

    // Create end date in IST (Indian Standard Time)
    const endTimeIST = new Date(year, month - 1, day, hours, minutes);

    // Convert IST to UTC
    const endTimeUTC = new Date(
      Date.UTC(year, month - 1, day, hours, minutes) - 
      5.5 * 60 * 60 * 1000 // IST is UTC+5:30
    );

    // Get current time in UTC
    const currentUTC = new Date().toISOString();

    // Compare the timestamps directly
    return new Date(currentUTC) > endTimeUTC;
  } catch (error) {
    return true; // Treat any parsing errors as expired
  }
};