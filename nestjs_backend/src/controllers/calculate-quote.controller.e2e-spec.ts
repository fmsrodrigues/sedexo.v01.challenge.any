import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import request from 'supertest'

import { E2eTestModule } from '@/tests.module'

describe('CalculateQuoteController (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [E2eTestModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[POST] /calculate-quote', async () => {
    const res = await request(app.getHttpServer())
      .post('/quote')
      .send({
        recipient: {
          address: {
            zipcode: '01311000',
          },
        },
        volumes: [
          {
            category: 7,
            amount: 1,
            unitary_weight: 5,
            price: 349,
            sku: 'abc-teste-123',
            height: 0.2,
            width: 0.2,
            length: 0.2,
          },
          {
            category: 7,
            amount: 2,
            unitary_weight: 4,
            price: 556,
            sku: 'abc-teste-527',
            height: 0.4,
            width: 0.6,
            length: 0.15,
          },
        ],
      })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({
      carrier: [
        {
          name: 'JADLOG',
          service: '.PACKAGE',
          deadline: 13,
          price: 35.99,
        },
        {
          name: 'CORREIOS',
          service: 'PAC',
          deadline: 15,
          price: 44.96,
        },
        {
          name: 'CORREIOS',
          service: 'SEDEX',
          deadline: 11,
          price: 74.17,
        },
        {
          name: 'BTU BRASPRESS',
          service: 'Normal',
          deadline: 15,
          price: 93.35,
        },
        {
          name: 'CORREIOS',
          service: 'PAC',
          deadline: 15,
          price: 112.96,
        },
        {
          name: 'CORREIOS',
          service: 'SEDEX',
          deadline: 11,
          price: 205.54,
        },
        {
          name: 'PRESSA FR (TESTE)',
          service: 'Normal',
          deadline: 11,
          price: 1599.39,
        },
        {
          name: 'PRESSA FR (TESTE)',
          service: 'Normal',
          deadline: 11,
          price: 1599.39,
        },
      ],
    })
  })
})
