export const calculateExperience = (startDate, endDate) => {
  // Convert DD/MM/YY to YYYY-MM-DD format
  const formatDate = (dateStr) => {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `20${year}-${month}-${day}`; // Ensures year is 20XX
    }
    return dateStr; // Return as is if already correct
  };

  const start = new Date(formatDate(startDate));
  const end = endDate ? new Date(formatDate(endDate)) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { years: 0, months: 0, total: "0 yrs 0 mo" }; // Handle invalid dates
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, total: `${years} yrs ${months} mo` };
};
