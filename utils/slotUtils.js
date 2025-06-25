export const isSlotExpired = slot => {
  try {
    const [month, day, year] = slot.date.split('/').map(Number)

    const timeMatch = slot.to.match(/(\d+):(\d+)\s*(AM|PM)?/i)
    if (!timeMatch) return true

    let [, hours, minutes, period] = timeMatch
    hours = parseInt(hours, 10)
    minutes = parseInt(minutes, 10)

    if (period?.toUpperCase() === 'PM' && hours < 12) hours += 12
    if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0

    const endTimeIST = new Date(year, month - 1, day, hours, minutes)

    const endTimeUTC = new Date(
      Date.UTC(year, month - 1, day, hours, minutes) - 5.5 * 60 * 60 * 1000
    )

    const currentUTC = new Date().toISOString()

    return new Date(currentUTC) > endTimeUTC
  } catch (error) {
    return true
  }
}
