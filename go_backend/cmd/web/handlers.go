package main

import (
	"encoding/json"
	"math"
	"net/http"
	"strconv"
)

type Recipient struct {
	Address Address `json:"address"`
}

type Address struct {
	Zipcode string `json:"zipcode"`
}

type Volume struct {
	Category      int     `json:"category"`
	Amount        int     `json:"amount"`
	UnitaryWeight int     `json:"unitary_weight"`
	Price         int     `json:"price"`
	Sku           string  `json:"sku"`
	Height        float64 `json:"height"`
	Width         float64 `json:"width"`
	Length        float64 `json:"length"`
}

func (app *application) quote(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Recipient Recipient `json:"recipient"`
		Volumes   []Volume  `json:"volumes"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		app.serverError(w, err)
		return
	}

	freteRapido := &FreteRapidoAPI{}
	offers, err := freteRapido.FetchQuoteOffers(body.Recipient, body.Volumes)
	if err != nil {
		app.serverError(w, err)
		return
	}

	for _, offer := range offers.Offers {
		if err := app.offers.Insert(offers.Quote, offer.Carrier, offer.Service, offer.Deadline, offer.Price); err != nil {
			app.serverError(w, err)
			return
		}
	}

	resBody := struct {
		Carrier []Offer `json:"carrier"`
	}{
		Carrier: offers.Offers,
	}

	res, err := json.Marshal(resBody)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.Write(res)
}

type CarrierMetrics struct {
	Name              string  `json:"name"`
	OffersAmount      int     `json:"offers"`
	TotalOffersPrice  float64 `json:"totalOffersPrice"`
	AverageOfferPrice float64 `json:"averageOfferPrice"`
}

func (app *application) metrics(w http.ResponseWriter, r *http.Request) {
	quoteAmount := 0
	quoteAmountParam := r.URL.Query().Get("last_quotes")
	if v, err := strconv.Atoi(quoteAmountParam); err == nil {
		quoteAmount = v
	}

	quotes, err := app.offers.FindUniqueQuotes(quoteAmount)
	if err != nil {
		app.serverError(w, err)
		return
	}

	offers, err := app.offers.FindByQuotes(quotes)
	if err != nil {
		app.serverError(w, err)
		return
	}

	cheapestOffer := math.MaxFloat64
	mostExpensiveOffer := float64(0)
	var carrierMetrics []*CarrierMetrics

out:
	for _, offer := range offers {
		if offer.Price < cheapestOffer {
			cheapestOffer = offer.Price
		}

		if offer.Price > mostExpensiveOffer {
			mostExpensiveOffer = offer.Price
		}

		for _, carrierMetric := range carrierMetrics {
			if carrierMetric.Name == offer.Carrier {
				carrierMetric.OffersAmount++
				carrierMetric.TotalOffersPrice += offer.Price
				carrierMetric.AverageOfferPrice = carrierMetric.TotalOffersPrice / float64(carrierMetric.OffersAmount)
				continue out
			}
		}

		carrierMetrics = append(carrierMetrics, &CarrierMetrics{
			Name:              offer.Carrier,
			OffersAmount:      1,
			TotalOffersPrice:  offer.Price,
			AverageOfferPrice: offer.Price,
		})
	}

	resBody := struct {
		CheapestOffer      float64           `json:"cheapestOffer"`
		MostExpensiveOffer float64           `json:"mostExpensiveOffer"`
		CarriersMetrics    []*CarrierMetrics `json:"carriersMetrics"`
	}{
		CheapestOffer:      cheapestOffer,
		MostExpensiveOffer: mostExpensiveOffer,
		CarriersMetrics:    carrierMetrics,
	}

	res, err := json.Marshal(resBody)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.Write(res)
}
