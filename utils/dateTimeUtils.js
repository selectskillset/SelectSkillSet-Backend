export const parseTimeSlot = (timeString) => {
    if (!timeString || typeof timeString !== "string") return null;
  
    const [_, endTime] = timeString.split(" - ");
    const [time, period] = endTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    // Convert to 24-hour format
    hours =
      period === "PM" && hours !== 12
        ? hours + 12
        : period === "AM" && hours === 12
        ? 0
        : hours;
  
    return { hours, minutes };
  };
  
  export const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) return "N/A";
    return date.toLocaleDateString("en-IN");
  };
  
  export const formatDay = (date) => {
    if (!date || isNaN(new Date(date))) return "N/A";
    return date.toLocaleDateString("en-IN", { weekday: "long" });
  };
  
  export const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== "string") return "N/A";
    return timeString.replace(
      /(\d+:\d+) ([AP]M) - (\d+:\d+) ([AP]M)/,
      "$1 $2 - $3 $4"
    );
  };
  
  export const isPastRequest = (requestDate, requestTime) => {
    try {
      if (!requestDate || isNaN(requestDate)) return true;
  
      // Parse time slot
      const { hours, minutes } = parseTimeSlot(requestTime) || {};
      if (hours === undefined || minutes === undefined) return true;
  
      // Create end date in IST (Indian Standard Time)
      const endTimeIST = new Date(
        requestDate.getFullYear(),
        requestDate.getMonth(),
        requestDate.getDate(),
        hours,
        minutes
      );
  
      // Convert IST to UTC (IST is UTC+5:30)
      const endTimeUTC = new Date(endTimeIST.getTime() - 5.5 * 60 * 60 * 1000);
  
      // Get current time in UTC (timezone-agnostic)
      const currentUTC = new Date().toISOString();
  
      // Compare the timestamps directly
      return new Date(currentUTC) > endTimeUTC;
    } catch (error) {
      return true; // Treat any parsing errors as expired
    }
  };