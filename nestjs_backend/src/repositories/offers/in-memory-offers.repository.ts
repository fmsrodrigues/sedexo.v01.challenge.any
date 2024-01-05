import { Injectable } from '@nestjs/common'
import { CreateOfferData, Offer, OffersRepository } from './offers.interface'

@Injectable()
export class InMemoryOffersRepository implements OffersRepository {
  offers: Offer[] = []
  id = 0

  async create(data: CreateOfferData) {
    this.offers.push({
      id: this.id++,

      quote: data.quote,
      service: data.service,
      carrier: data.carrier,
      price: data.price,
      deadline: data.deadline,

      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async findUniqueQuotes(amount?: number | undefined): Promise<string[]> {
    const quotes = [...this.offers]
      .reverse()
      .slice(0, amount)
      .map((offer) => offer.quote)

    return quotes
  }

  async findByQuotes(quotes: string[]): Promise<Offer[]> {
    const offers = this.offers.filter((offer) => quotes.includes(offer.quote))

    return offers
  }
}
