import { calculateDifferenceBetweenDatesInDays } from './calculate-difference-between-dates-in-days'

describe('Calculate difference between dates in days (Unit Test)', () => {
  it("should return 0 days to the difference between 2021-01-01 and 2021-01-01 (it's the same day)", () => {
    const date1 = new Date('2021-01-01')
    const date2 = new Date('2021-01-01')

    const differenceInDays = calculateDifferenceBetweenDatesInDays(date1, date2)
    expect(differenceInDays).toBe(0)
  })

  it('should return 1 day to the difference between 2021-01-01 and 2021-01-02', () => {
    const date1 = new Date('2021-01-01')
    const date2 = new Date('2021-01-02')

    const differenceInDays = calculateDifferenceBetweenDatesInDays(date1, date2)
    expect(differenceInDays).toBe(1)
  })

  it('should return 31 days to the difference between 2021-01-01 and 2021-02-01', () => {
    const date1 = new Date('2021-01-01')
    const date2 = new Date('2021-02-01')

    const differenceInDays = calculateDifferenceBetweenDatesInDays(date1, date2)
    expect(differenceInDays).toBe(31)
  })

  it('should return 365 days to the difference between 2021-01-01 and 2022-01-01', () => {
    const date1 = new Date('2021-01-01')
    const date2 = new Date('2022-01-01')

    const differenceInDays = calculateDifferenceBetweenDatesInDays(date1, date2)
    expect(differenceInDays).toBe(365)
  })

  it('should return 366 days to the difference between 2020-01-01 and 2021-01-01 due to 2020 being a leap year', () => {
    const date1 = new Date('2021-01-01')
    const date2 = new Date('2022-01-01')

    const differenceInDays = calculateDifferenceBetweenDatesInDays(date1, date2)
    expect(differenceInDays).toBe(365)
  })
})
