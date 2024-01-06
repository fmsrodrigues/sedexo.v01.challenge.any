package helper

import (
	"math"
	"time"
)

func CalculateDifferenceBetweenDatesInDays(date1, date2 time.Time) int64 {
	difference := date1.Sub(date2)
	return int64(math.Ceil(difference.Abs().Hours() / 24))
}
