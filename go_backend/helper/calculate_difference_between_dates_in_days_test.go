package helper

import (
	"testing"
	"time"

	"sedexo.v01.challenge.any/internal/assert"
)

func TestCalculateDifferenceBetweenDatesInDays(t *testing.T) {
	tests := []struct {
		name     string
		date1    string
		date2    string
		expected int64
	}{
		{
			name:     "same day",
			date1:    "2021-01-01",
			date2:    "2021-01-01",
			expected: 0,
		},
		{
			name:     "next day",
			date1:    "2021-01-01",
			date2:    "2021-01-02",
			expected: 1,
		},
		{
			name:     "next month",
			date1:    "2021-01-01",
			date2:    "2021-02-01",
			expected: 31,
		},
		{
			name:     "next year",
			date1:    "2021-01-01",
			date2:    "2022-01-01",
			expected: 365,
		},
		{
			name:     "leap year",
			date1:    "2020-01-01",
			date2:    "2021-01-01",
			expected: 366,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			date1, _ := time.Parse("2006-01-02", tt.date1)
			date2, _ := time.Parse("2006-01-02", tt.date2)

			assert.Equal(t, tt.expected, CalculateDifferenceBetweenDatesInDays(date1, date2))
		})
	}
}
