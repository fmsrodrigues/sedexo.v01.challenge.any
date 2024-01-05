export function calculateDifferenceBetweenDatesInDays(
  date1: Date,
  date2: Date,
) {
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())

  return Math.floor((utc2 - utc1) / MILLISECONDS_PER_DAY)
}
