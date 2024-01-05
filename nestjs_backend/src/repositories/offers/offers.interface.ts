export interface Offer {
  id: number
  quote: string
  carrier: string
  service: string
  price: number
  deadline: number
  createdAt: Date
  updatedAt: Date
}

export type CreateOfferData = Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>

export abstract class OffersRepository {
  abstract create: (data: CreateOfferData) => Promise<void>
  abstract findUniqueQuotes: (amount?: number) => Promise<string[]>
  abstract findByQuotes: (quotes: string[]) => Promise<Offer[]>
}
