import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

import { Env } from '@/env'
import {
  Dispatcher,
  FreteRapidoService,
  QuoteOffers,
} from './frete-rapido.interfaces'
import { VolumeDTO } from '@/dto/volume.dto'

@Injectable()
export class FreteRapidoAPIService implements FreteRapidoService {
  private token: string
  private cnpj: string
  private plataforma: string
  private zipcode: number

  constructor(private config: ConfigService<Env, true>) {
    this.token = this.config.get('FRETE_RAPIDO_API_TOKEN', { infer: true })

    this.cnpj = this.config.get('FRETE_RAPIDO_API_CNPJ', { infer: true })

    this.plataforma = this.config.get('FRETE_RAPIDO_API_PLATAFORMA', {
      infer: true,
    })

    const cep = Number(this.config.get('FRETE_RAPIDO_API_CEP', { infer: true }))
    if (isNaN(cep)) {
      throw new Error('CEP must be a string number with 8 digits')
    }

    this.zipcode = cep
  }

  private sanitizeVolumes(volumes: VolumeDTO[]) {
    return volumes.map((volume) => {
      return {
        amount: volume.amount,
        category: String(volume.category),
        sku: volume.sku ?? undefined,
        height: volume.height,
        width: volume.width,
        length: volume.length,
        unitary_price: volume.price,
        unitary_weight: volume.unitary_weight,
      }
    })
  }

  async fetchQuoteOffers(
    recipientZipcode: string,
    volumes: VolumeDTO[],
  ): Promise<QuoteOffers> {
    const sanitizedVolumes = this.sanitizeVolumes(volumes)

    const zipcode = Number(recipientZipcode)
    if (isNaN(zipcode)) {
      throw new Error('CEP must be a string number with 8 digits')
    }

    try {
      const res = await axios.post<{ dispatchers: Dispatcher[] }>(
        'https://sp.freterapido.com/api/v3/quote/simulate',
        {
          shipper: {
            registered_number: this.cnpj,
            token: this.token,
            platform_code: this.plataforma,
          },
          recipient: {
            type: 0,
            country: 'BRA',
            zipcode,
          },
          dispatchers: [
            {
              registered_number: this.cnpj,
              zipcode: this.zipcode,
              volumes: sanitizedVolumes,
            },
          ],
          simulation_type: [0],
          returns: {
            composition: false,
            volumes: false,
            applied_rules: false,
          },
        },
      )

      const offers = res.data.dispatchers[0].offers
      const cleanOffers = offers.map((offer) => {
        return {
          carrier: offer.carrier.name,
          service: offer.service,
          deadline: {
            days: offer.delivery_time.days,
            estimatedDate: offer.delivery_time.estimated_date,
          },
          price: offer.final_price,
        }
      })

      return {
        quote: res.data.dispatchers[0].id,
        offers: cleanOffers,
      }
    } catch (err) {
      throw new Error('Failed to fetch quote offers')
    }
  }
}
