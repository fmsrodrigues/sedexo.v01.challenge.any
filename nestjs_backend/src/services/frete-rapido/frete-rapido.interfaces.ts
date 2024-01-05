import { VolumeDTO } from '@/dto/volume.dto'

export interface Carrier {
  name: string
}

export interface DeliveryTime {
  days?: number
  estimated_date: string
}

export interface Offer {
  service: string
  final_price: number

  carrier: Carrier
  delivery_time: DeliveryTime
}

export interface Dispatcher {
  id: string

  offers: Offer[]
}

export interface QuoteOffers {
  quote: string
  offers: {
    carrier: string
    service: string
    deadline: {
      days?: number
      estimatedDate: string
    }
    price: number
  }[]
}

export abstract class FreteRapidoService {
  abstract fetchQuoteOffers(
    recipientZipcode: string,
    volumes: VolumeDTO[],
  ): Promise<QuoteOffers>
}
