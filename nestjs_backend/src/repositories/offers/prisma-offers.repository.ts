import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/services/prisma/prisma.service'
import { CreateOfferData, Offer, OffersRepository } from './offers.interface'

@Injectable()
export class PrismaOffersRepository implements OffersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOfferData) {
    await this.prisma.offer.create({
      data: {
        quote: data.quote,
        service: data.service,
        carrier: data.carrier,
        price: data.price,
        deadline: data.deadline,
      },
    })
  }

  async findUniqueQuotes(amount?: number | undefined): Promise<string[]> {
    const quotes = await this.prisma.offer.findMany({
      select: {
        quote: true,
      },
      distinct: ['quote'],
      take: amount,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return quotes.map((quotes) => quotes.quote)
  }

  async findByQuotes(quotes: string[]): Promise<Offer[]> {
    const offers = await this.prisma.offer.findMany({
      where: {
        quote: {
          in: quotes,
        },
      },
    })

    return offers
  }
}
