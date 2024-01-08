package repositories

import (
	"database/sql"
	"slices"
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

type OffersRepository interface {
	Insert(quote, carrier, service string, deadline int, price float64) error
	FindUniqueQuotes(amount int) ([]string, error)
	FindByQuotes(quotes []string) ([]*Offer, error)
}

type RawOffersRepository struct {
	DB *sql.DB
}

func (r *RawOffersRepository) Insert(quote, carrier, service string, deadline int, price float64) error {
	stmt := `
		INSERT INTO offers (quote, carrier, service, deadline, price, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())
	`

	_, err := r.DB.Exec(stmt, quote, carrier, service, deadline, price)
	if err != nil {
		return err
	}

	return nil
}

func (r *RawOffersRepository) FindUniqueQuotes(amount int) ([]string, error) {
	var rows *sql.Rows
	var err error

	if amount > 0 {
		stmt := `
			SELECT DISTINCT quote
			FROM offers
			ORDER BY created_at DESC
			LIMIT ?
		`
		rows, err = r.DB.Query(stmt, amount)
		if err != nil {
			return nil, err
		}
	} else {
		stmt := `
			SELECT DISTINCT quote
			FROM offers
			ORDER BY created_at DESC
		`

		rows, err = r.DB.Query(stmt)
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

func (r *RawOffersRepository) FindByQuotes(quotes []string) ([]*Offer, error) {
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

	rows, err := r.DB.Query(stmt, args...)
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

type InMemoryOffersRepository struct {
	offers []*Offer
}

func NewInMemoryOffersRepository(offers []*Offer) *InMemoryOffersRepository {
	if offers == nil {
		return &InMemoryOffersRepository{
			offers: make([]*Offer, 0),
		}
	}

	return &InMemoryOffersRepository{
		offers: offers,
	}
}

func (r *InMemoryOffersRepository) Insert(quote, carrier, service string, deadline int, price float64) error {
	offer := &Offer{
		Quote:     quote,
		Carrier:   carrier,
		Service:   service,
		Deadline:  deadline,
		Price:     price,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	r.offers = append(r.offers, offer)
	return nil
}

func (r *InMemoryOffersRepository) FindUniqueQuotes(amount int) ([]string, error) {
	quotes := make([]string, 0)
	uniqueQuotes := make(map[string]bool)

	for _, offer := range r.offers {
		if !uniqueQuotes[offer.Quote] {
			uniqueQuotes[offer.Quote] = true
			quotes = append(quotes, offer.Quote)
		}
	}

	if amount > 0 && amount < len(quotes) {
		slices.Reverse(quotes)
		quotes = quotes[:amount]
	}

	return quotes, nil
}

func (r *InMemoryOffersRepository) FindByQuotes(quotes []string) ([]*Offer, error) {
	result := make([]*Offer, 0)

	for _, offer := range r.offers {
		for _, quote := range quotes {
			if offer.Quote == quote {
				result = append(result, offer)
				break
			}
		}
	}

	return result, nil
}
