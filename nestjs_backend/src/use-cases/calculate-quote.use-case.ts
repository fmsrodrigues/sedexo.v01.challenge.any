import { VolumeDTO } from '@/dto/volume.dto'
import { calculateDifferenceBetweenDatesInDays } from '@/helpers/calculate-difference-between-dates-in-days'
import { OffersRepository } from '@/repositories/offers/offers.interface'
import { FreteRapidoService } from '@/services/frete-rapido/frete-rapido.interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CalculateQuoteUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private freteRapido: FreteRapidoService,
  ) {}

  async handle(recipientZipcode: string, volumes: VolumeDTO[]) {
    const quoteOffers = await this.freteRapido.fetchQuoteOffers(
      recipientZipcode,
      volumes,
    )

    const offers = quoteOffers.offers.map((offer) => {
      return {
        carrier: offer.carrier,
        service: offer.service,
        deadline:
          offer.deadline.days ||
          calculateDifferenceBetweenDatesInDays(
            new Date(),
            new Date(offer.deadline.estimatedDate),
          ),
        price: offer.price,
      }
    })

    const offersPromise = offers.map((offer) => {
      return this.offersRepository.create({
        ...offer,
        quote: quoteOffers.quote,
      })
    })
    await Promise.allSettled(offersPromise)

    return offers
  }
}
