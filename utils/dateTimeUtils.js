export const parseTimeSlot = (timeString) => {
  try {
    const endTime = timeString.split(" - ").pop().trim(); 
    const [time, period] = endTime.split(" ");
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr || "0", 10);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  } catch (error) {
    console.error("Error parsing time:", error);
    return null;
  }
};

export const formatDate = (date, timezoneOffset) => {
  const localDate = new Date(date.getTime() + timezoneOffset * 60 * 60 * 1000);
  return localDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDay = (date) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getUTCDay()];
};

export const formatTime = (timeRange) => {
  return timeRange; // Return the original time range as-is
};

export const isPastRequest = (requestDate, requestTime) => {
  try {
    const now = new Date(); // Current date and time
    const [day, month, year] = requestDate.split("/"); // Parse date in DD/MM/YYYY format
    const parsedDate = new Date(Date.UTC(year, month - 1, day)); // Create UTC date

    // Parse time (e.g., "12:01 AM - 12:01 AM")
    const endTimeSlot = parseTimeSlot(requestTime);
    if (!endTimeSlot) return true; // Invalid time is treated as expired

    // Set end datetime in UTC
    const endDateTime = new Date(
      Date.UTC(year, month - 1, day, endTimeSlot.hours, endTimeSlot.minutes)
    );

    // Compare with current time
    return endDateTime < now; // Return true if the request is in the past
  } catch (error) {
    console.error("Error checking past request:", error);
    return true; // Treat invalid requests as expired
  }
};
