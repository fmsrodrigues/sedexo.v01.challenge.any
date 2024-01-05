import { Injectable } from '@nestjs/common'
import { FreteRapidoService, QuoteOffers } from './frete-rapido.interfaces'
import { VolumeDTO } from '@/dto/volume.dto'

@Injectable()
export class FreteRapidoMockService implements FreteRapidoService {
  async fetchQuoteOffers(
    _recipientZipcode: string,
    _volumes: VolumeDTO[],
  ): Promise<QuoteOffers> {
    return {
      quote: '659712f5c5795477956bdc37',
      offers: [
        {
          carrier: 'JADLOG',
          service: '.PACKAGE',
          deadline: {
            days: 13,
            estimatedDate: '2024-01-23',
          },
          price: 35.99,
        },
        {
          carrier: 'CORREIOS',
          service: 'PAC',
          deadline: {
            days: 15,
            estimatedDate: '2024-01-25',
          },
          price: 44.96,
        },
        {
          carrier: 'CORREIOS',
          service: 'SEDEX',
          deadline: {
            days: 11,
            estimatedDate: '2024-01-19',
          },
          price: 74.17,
        },
        {
          carrier: 'BTU BRASPRESS',
          service: 'Normal',
          deadline: {
            days: 15,
            estimatedDate: '2024-01-25',
          },
          price: 93.35,
        },
        {
          carrier: 'CORREIOS',
          service: 'PAC',
          deadline: {
            days: 15,
            estimatedDate: '2024-01-25',
          },
          price: 112.96,
        },
        {
          carrier: 'CORREIOS',
          service: 'SEDEX',
          deadline: {
            days: 11,
            estimatedDate: '2024-01-19',
          },
          price: 205.54,
        },
        {
          carrier: 'PRESSA FR (TESTE)',
          service: 'Normal',
          deadline: {
            days: 11,
            estimatedDate: '2024-01-19',
          },
          price: 1599.39,
        },
        {
          carrier: 'PRESSA FR (TESTE)',
          service: 'Normal',
          deadline: {
            days: 11,
            estimatedDate: '2024-01-19',
          },
          price: 1599.39,
        },
      ],
    }
  }
}
