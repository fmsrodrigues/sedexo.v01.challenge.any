import { OffersRepository } from '@/repositories/offers/offers.interface'
import { Injectable } from '@nestjs/common'

export interface CarrierMetrics {
  name: string
  offers: number
  totalOffersPrice: number
  averageOffersPrice: number
}

@Injectable()
export class FetchQuoteMetricsUseCase {
  constructor(private offersRepository: OffersRepository) {}

  async handle(quoteAmount?: number) {
    const quotes = await this.offersRepository.findUniqueQuotes(quoteAmount)
    const offers = await this.offersRepository.findByQuotes(quotes)

    let cheapestOffer = Infinity
    let mostExpensiveOffer = 0
    const carriersMetrics: CarrierMetrics[] = []

    offers.forEach((offer) => {
      if (offer.price < cheapestOffer) {
        cheapestOffer = offer.price
      }

      if (offer.price > mostExpensiveOffer) {
        mostExpensiveOffer = offer.price
      }

      const carrierIndex = carriersMetrics.findIndex(
        (carrier) => carrier.name === offer.carrier,
      )

      if (carrierIndex === -1) {
        carriersMetrics.push({
          name: offer.carrier,
          offers: 1,
          totalOffersPrice: offer.price,
          averageOffersPrice: offer.price,
        })
      } else {
        carriersMetrics[carrierIndex].offers += 1
        carriersMetrics[carrierIndex].totalOffersPrice += offer.price
        carriersMetrics[carrierIndex].averageOffersPrice =
          carriersMetrics[carrierIndex].totalOffersPrice /
          carriersMetrics[carrierIndex].offers
      }
    })

    return {
      carriersMetrics,
      cheapestOffer: cheapestOffer === Infinity ? 0 : cheapestOffer,
      mostExpensiveOffer,
    }
  }
}
