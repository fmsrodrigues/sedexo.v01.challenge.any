package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"sedexo.v01.challenge.any/helper"
)

type Offer struct {
	Carrier  string  `json:"name"`
	Service  string  `json:"service"`
	Deadline int     `json:"deadline"`
	Price    float64 `json:"price"`
}

type QuoteOffer struct {
	Quote  string
	Offers []Offer
}

type FreteRapido interface {
	FetchQuoteOffers(Recipient, []Volume) (*QuoteOffer, error)
}

type DispatcherFetchQuoteOffersResponseBody struct {
	ID     string                              `json:"id"`
	Offers []OfferFetchQuoteOffersResponseBody `json:"offers"`
}

type OfferFetchQuoteOffersResponseBody struct {
	Carrier      CarrierFetchQuoteOffersResponseBody `json:"carrier"`
	DeliveryTime TimeFetchQuoteOffersResponseBody    `json:"delivery_time"`
	FinalPrice   float64                             `json:"final_price"`
	Service      string                              `json:"service"`
}

type CarrierFetchQuoteOffersResponseBody struct {
	Name string `json:"name"`
}

type TimeFetchQuoteOffersResponseBody struct {
	Days          int    `json:"days"`
	EstimatedDate string `json:"estimated_date"`
}

type FetchQuoteOffersResponseBody struct {
	Dispatchers []DispatcherFetchQuoteOffersResponseBody `json:"dispatchers"`
}

type FreteRapidoAPI struct{}

func (f *FreteRapidoAPI) sanitizeVolumes(volumes []Volume) []map[string]interface{} {
	var sanitizedVolumes []map[string]interface{}

	for _, volume := range volumes {
		sanitizedVolumes = append(sanitizedVolumes, map[string]interface{}{
			"amount":         volume.Amount,
			"category":       fmt.Sprintf("%d", volume.Category),
			"sku":            string(volume.Sku),
			"height":         volume.Height,
			"width":          volume.Width,
			"length":         volume.Length,
			"unitary_price":  volume.Price,
			"unitary_weight": volume.UnitaryWeight,
		})
	}

	return sanitizedVolumes
}

func (f *FreteRapidoAPI) FetchQuoteOffers(recipient Recipient, volumes []Volume) (*QuoteOffer, error) {
	env := NewEnvironment()

	sanitizedVolumes := f.sanitizeVolumes(volumes)

	recipientZipcode, err := strconv.Atoi(recipient.Address.Zipcode)
	if err != nil {
		return nil, err
	}

	postBody, err := json.Marshal(map[string]interface{}{
		"shipper": map[string]interface{}{
			"registered_number": env.FRETE_RAPIDO_API_CNPJ,
			"token":             env.FRETE_RAPIDO_API_TOKEN,
			"platform_code":     env.FRETE_RAPIDO_API_PLATAFORMA,
		},
		"recipient": map[string]interface{}{
			"type":    0,
			"country": "BRA",
			"zipcode": recipientZipcode,
		},
		"dispatchers": []map[string]interface{}{
			{
				"registered_number": env.FRETE_RAPIDO_API_CNPJ,
				"zipcode":           env.FRETE_RAPIDO_API_CEP,
				"volumes":           sanitizedVolumes,
			},
		},
		"simulation_type": []int{0},
		"returns": map[string]interface{}{
			"composition":   false,
			"volumes":       false,
			"applied_rules": false,
		},
	})
	if err != nil {
		return nil, err
	}

	res, err := http.Post("https://sp.freterapido.com/api/v3/quote/simulate", "application/json", bytes.NewBuffer(postBody))
	if err != nil {
		return nil, err
	}

	var resBody FetchQuoteOffersResponseBody

	defer res.Body.Close()
	decoder := json.NewDecoder(res.Body)
	err = decoder.Decode(&resBody)
	if err != nil {
		return nil, err
	}

	offers := make([]Offer, 0, len(resBody.Dispatchers[0].Offers))
	for _, offer := range resBody.Dispatchers[0].Offers {
		var deadline int
		if offer.DeliveryTime.Days > 0 {
			deadline = offer.DeliveryTime.Days
		} else {
			estimatedDate, err := time.Parse("2006-01-02", offer.DeliveryTime.EstimatedDate)
			if err != nil {
				return nil, err
			}

			date := helper.CalculateDifferenceBetweenDatesInDays(estimatedDate, time.Now())

			deadline = int(date)
		}

		offers = append(offers, Offer{
			Carrier:  offer.Carrier.Name,
			Service:  offer.Service,
			Deadline: deadline,
			Price:    offer.FinalPrice,
		})
	}

	return &QuoteOffer{
		Quote:  resBody.Dispatchers[0].ID,
		Offers: offers,
	}, nil
}

type FreteRapidoMock struct{}

func (f *FreteRapidoMock) FetchQuoteOffers(Recipient, []Volume) (*QuoteOffer, error) {
	return &QuoteOffer{
		Quote: "mocked-quote",
		Offers: []Offer{
			{
				Carrier:  "JADLOG",
				Service:  ".PACKAGE",
				Deadline: 13,
				Price:    35.99,
			},
			{Carrier: "CORREIOS", Service: "PAC", Deadline: 15, Price: 44.96},
			{Carrier: "CORREIOS", Service: "SEDEX", Deadline: 11, Price: 74.17},
			{
				Carrier:  "BTU BRASPRESS",
				Service:  "Normal",
				Deadline: 15,
				Price:    93.35,
			},
			{Carrier: "CORREIOS", Service: "PAC", Deadline: 15, Price: 112.96},
			{
				Carrier:  "CORREIOS",
				Service:  "SEDEX",
				Deadline: 11,
				Price:    205.54,
			},
			{
				Carrier:  "PRESSA FR (TESTE)",
				Service:  "Normal",
				Deadline: 11,
				Price:    1599.39,
			},
			{
				Carrier:  "PRESSA FR (TESTE)",
				Service:  "Normal",
				Deadline: 11,
				Price:    1599.39,
			},
		},
	}, nil
}
