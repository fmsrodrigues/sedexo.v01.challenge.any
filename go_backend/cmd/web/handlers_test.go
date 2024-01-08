package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http/httptest"
	"testing"

	"sedexo.v01.challenge.any/internal/assert"
	"sedexo.v01.challenge.any/internal/repositories"
)

func TestQuote(t *testing.T) {
	requestBody := []byte(`
		{
			"recipient":{
				"address":{
					"zipcode":"01311000"
				}
			},
			"volumes":[
				{
					"category":7,
					"amount":1,
					"unitary_weight":5,
					"price":349,
					"sku":"abc-teste-123",
					"height":0.2,
					"width":0.2,
					"length":0.2
				},
				{
					"category":7,
					"amount":2,
					"unitary_weight":4,
					"price":556,
					"sku":"abc-teste-527",
					"height":0.4,
					"width":0.6,
					"length":0.15
				}
			]
		}
	`)

	t.Run("Returns all offers for a given delivery", func(t *testing.T) {
		responseBody := []byte(`{"carrier":[{"name":"JADLOG","service":".PACKAGE","deadline":13,"price":35.99},{"name":"CORREIOS","service":"PAC","deadline":15,"price":44.96},{"name":"CORREIOS","service":"SEDEX","deadline":11,"price":74.17},{"name":"BTU BRASPRESS","service":"Normal","deadline":15,"price":93.35},{"name":"CORREIOS","service":"PAC","deadline":15,"price":112.96},{"name":"CORREIOS","service":"SEDEX","deadline":11,"price":205.54},{"name":"PRESSA FR (TESTE)","service":"Normal","deadline":11,"price":1599.39},{"name":"PRESSA FR (TESTE)","service":"Normal","deadline":11,"price":1599.39}]}`)

		app := newTestApplication()

		ts := httptest.NewServer(app.routes())
		defer ts.Close()

		rs, err := ts.Client().Post(ts.URL+"/quote", "application/json", bytes.NewReader(requestBody))
		if err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, 200, rs.StatusCode)

		defer rs.Body.Close()
		body, err := io.ReadAll(rs.Body)
		if err != nil {
			t.Fatal(err)
		}
		bytes.TrimSpace(body)

		assert.Equal(t, string(body), string(responseBody))
	})
}

func TestMetrics(t *testing.T) {
	t.Run("Returns all carrier metrics based on the last 3 quotes", func(t *testing.T) {
		responseBody := []byte(`{"cheapestOffer":17,"mostExpensiveOffer":19,"carriersMetrics":[{"name":"carrier 7","offers":1,"totalOffersPrice":17,"averageOfferPrice":17},{"name":"carrier 8","offers":1,"totalOffersPrice":18,"averageOfferPrice":18},{"name":"carrier 9","offers":1,"totalOffersPrice":19,"averageOfferPrice":19}]}`)

		app := newTestApplication()

		ts := httptest.NewServer(app.routes())
		defer ts.Close()

		rs, err := ts.Client().Get(ts.URL + "/metrics?last_quotes=3")
		if err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, 200, rs.StatusCode)

		defer rs.Body.Close()
		body, err := io.ReadAll(rs.Body)
		if err != nil {
			t.Fatal(err)
		}
		bytes.TrimSpace(body)

		assert.Equal(t, string(body), string(responseBody))
	})

	t.Run("Returns all carrier metrics based on all quotes", func(t *testing.T) {
		responseBody := []byte(`{"cheapestOffer":10,"mostExpensiveOffer":19,"carriersMetrics":[{"name":"carrier 0","offers":1,"totalOffersPrice":10,"averageOfferPrice":10},{"name":"carrier 1","offers":1,"totalOffersPrice":11,"averageOfferPrice":11},{"name":"carrier 2","offers":1,"totalOffersPrice":12,"averageOfferPrice":12},{"name":"carrier 3","offers":1,"totalOffersPrice":13,"averageOfferPrice":13},{"name":"carrier 4","offers":1,"totalOffersPrice":14,"averageOfferPrice":14},{"name":"carrier 5","offers":1,"totalOffersPrice":15,"averageOfferPrice":15},{"name":"carrier 6","offers":1,"totalOffersPrice":16,"averageOfferPrice":16},{"name":"carrier 7","offers":1,"totalOffersPrice":17,"averageOfferPrice":17},{"name":"carrier 8","offers":1,"totalOffersPrice":18,"averageOfferPrice":18},{"name":"carrier 9","offers":1,"totalOffersPrice":19,"averageOfferPrice":19}]}`)

		app := newTestApplication()

		ts := httptest.NewServer(app.routes())
		defer ts.Close()

		rs, err := ts.Client().Get(ts.URL + "/metrics")
		if err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, 200, rs.StatusCode)

		defer rs.Body.Close()
		body, err := io.ReadAll(rs.Body)
		if err != nil {
			t.Fatal(err)
		}
		bytes.TrimSpace(body)

		assert.Equal(t, string(body), string(responseBody))
	})
}

func newTestApplication() *application {
	var offers []*repositories.Offer

	for i := 0; i < 10; i++ {
		offers = append(offers, &repositories.Offer{
			Quote:    fmt.Sprintf("quote %v", i),
			Carrier:  fmt.Sprintf("carrier %v", i),
			Service:  fmt.Sprintf("service %v", i),
			Deadline: i + 2,
			Price:    float64(i + 10),
		})
	}

	app := &application{
		errorLog:    log.New(ioutil.Discard, "", 0),
		infoLog:     log.New(ioutil.Discard, "", 0),
		offers:      repositories.NewInMemoryOffersRepository(offers),
		freteRapido: &FreteRapidoMock{},
	}

	return app
}
