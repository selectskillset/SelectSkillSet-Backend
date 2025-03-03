export const isSlotExpired = (slot) => {
  try {
    // Parse date components from MM/dd/yyyy format
    const [month, day, year] = slot.date.split('/').map(Number);
    
    // Parse time components from h:mm a format
    const timeMatch = slot.to.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!timeMatch) return true;
    
    let [, hours, minutes, period] = timeMatch;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    
    // Convert to 24-hour format
    if (period?.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0;

    // Create end date in local time (based on the provided date and time)
    const endTime = new Date(year, month - 1, day, hours, minutes);
    
    // Get current time in local time
    const currentDate = new Date();

    // Compare the timestamps directly
    return currentDate.getTime() > endTime.getTime();
  } catch (error) {
    return true; // Treat any parsing errors as expired
  }
};