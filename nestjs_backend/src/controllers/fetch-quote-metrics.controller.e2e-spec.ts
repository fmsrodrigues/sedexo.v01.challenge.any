import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import request from 'supertest'

import { OffersRepository } from '@/repositories/offers/offers.interface'
import { E2eTestModule } from '@/tests.module'

describe('FetchQuoteMetricsController (E2E)', () => {
  let app: INestApplication, offersRepository: OffersRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [E2eTestModule],
    }).compile()

    app = moduleRef.createNestApplication()
    offersRepository = moduleRef.get<OffersRepository>(OffersRepository)

    await app.init()
  })

  beforeEach(async () => {
    for (let i = 0; i < 10; i++) {
      await offersRepository.create({
        quote: `quote ${i}`,
        service: `service ${i}`,
        carrier: `carrier ${i}`,
        price: i + 10,
        deadline: i + 2,
      })
    }
  })

  test('[GET] /metrics', async () => {
    const res = await request(app.getHttpServer()).get('/metrics').send()

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      carriersMetrics: [
        {
          name: 'carrier 0',
          offers: 1,
          totalOffersPrice: 10,
          averageOffersPrice: 10,
        },
        {
          name: 'carrier 1',
          offers: 1,
          totalOffersPrice: 11,
          averageOffersPrice: 11,
        },
        {
          name: 'carrier 2',
          offers: 1,
          totalOffersPrice: 12,
          averageOffersPrice: 12,
        },
        {
          name: 'carrier 3',
          offers: 1,
          totalOffersPrice: 13,
          averageOffersPrice: 13,
        },
        {
          name: 'carrier 4',
          offers: 1,
          totalOffersPrice: 14,
          averageOffersPrice: 14,
        },
        {
          name: 'carrier 5',
          offers: 1,
          totalOffersPrice: 15,
          averageOffersPrice: 15,
        },
        {
          name: 'carrier 6',
          offers: 1,
          totalOffersPrice: 16,
          averageOffersPrice: 16,
        },
        {
          name: 'carrier 7',
          offers: 1,
          totalOffersPrice: 17,
          averageOffersPrice: 17,
        },
        {
          name: 'carrier 8',
          offers: 1,
          totalOffersPrice: 18,
          averageOffersPrice: 18,
        },
        {
          name: 'carrier 9',
          offers: 1,
          totalOffersPrice: 19,
          averageOffersPrice: 19,
        },
      ],
      cheapestOffer: 10,
      mostExpensiveOffer: 19,
    })
  })

  test('[GET] /metrics?last_quotes=3', async () => {
    const res = await request(app.getHttpServer())
      .get('/metrics')
      .query({ last_quotes: 3 })
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      carriersMetrics: [
        {
          name: 'carrier 7',
          offers: 2,
          totalOffersPrice: 34,
          averageOffersPrice: 17,
        },
        {
          name: 'carrier 8',
          offers: 2,
          totalOffersPrice: 36,
          averageOffersPrice: 18,
        },
        {
          name: 'carrier 9',
          offers: 2,
          totalOffersPrice: 38,
          averageOffersPrice: 19,
        },
      ],
      cheapestOffer: 17,
      mostExpensiveOffer: 19,
    })
  })
})
