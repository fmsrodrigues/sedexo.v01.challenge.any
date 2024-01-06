package models

import (
	"database/sql"
	"strings"
	"time"
)

type Offer struct {
	ID        int       `json:"id"`
	Quote     string    `json:"quote"`
	Carrier   string    `json:"carrier"`
	Service   string    `json:"service"`
	Deadline  int       `json:"deadline"`
	Price     float64   `json:"price"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type OfferModel struct {
	DB *sql.DB
}

func (m *OfferModel) Insert(quote, carrier, service string, deadline int, price float64) error {
	stmt := `
		INSERT INTO offers (quote, carrier, service, deadline, price, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())
	`

	_, err := m.DB.Exec(stmt, quote, carrier, service, deadline, price)
	if err != nil {
		return err
	}

	return nil
}

func (m *OfferModel) FindUniqueQuotes(amount int) ([]string, error) {
	var rows *sql.Rows
	var err error

	if amount > 0 {
		stmt := `
			SELECT DISTINCT quote
			FROM offers
			ORDER BY created_at DESC
			LIMIT ?
		`
		rows, err = m.DB.Query(stmt, amount)
		if err != nil {
			return nil, err
		}
	} else {
		stmt := `
			SELECT DISTINCT quote
			FROM offers
			ORDER BY created_at DESC
		`

		rows, err = m.DB.Query(stmt)
		if err != nil {
			return nil, err
		}
	}
	defer rows.Close()

	quotes := []string{}

	for rows.Next() {
		var s string

		err = rows.Scan(&s)
		if err != nil {
			return nil, err
		}

		quotes = append(quotes, s)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return quotes, nil
}

func (m *OfferModel) FindByQuotes(quotes []string) ([]*Offer, error) {
	stmt := `
		SELECT * FROM offers WHERE quote IN (?);
	`

	args := make([]interface{}, len(quotes))
	for i, v := range quotes {
		args[i] = v
	}

	placeholders := make([]string, len(quotes))
	for i := range placeholders {
		placeholders[i] = "?"
	}

	placeholderStr := strings.Join(placeholders, ",")
	stmt = strings.Replace(stmt, "?", placeholderStr, 1)

	rows, err := m.DB.Query(stmt, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	offers := []*Offer{}

	for rows.Next() {
		offer := &Offer{}

		err = rows.Scan(&offer.ID, &offer.Quote, &offer.Carrier, &offer.Service, &offer.Deadline, &offer.Price, &offer.CreatedAt, &offer.UpdatedAt)
		if err != nil {
			return nil, err
		}

		offers = append(offers, offer)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return offers, nil
}
