import { parse, isAfter } from 'date-fns';

export const isSlotExpired = (slot) => {
  try {
    const currentDate = new Date();
    const slotDate = parse(slot.date, 'MM/dd/yyyy', new Date());
    const endTime = parse(slot.to, 'h:mm a', slotDate);
    return isAfter(currentDate, endTime);
  } catch (error) {
    return true; // Treat invalid dates as expired
  }
};