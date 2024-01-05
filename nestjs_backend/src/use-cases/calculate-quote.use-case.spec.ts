import { Test } from '@nestjs/testing'

import { OffersRepository } from '@/repositories/offers/offers.interface'
import { UnitTestModule } from '@/tests.module'
import { CalculateQuoteUseCase } from './calculate-quote.use-case'
import { FreteRapidoService } from '@/services/frete-rapido/frete-rapido.interfaces'

describe('CalculateQuoteUseCase (Unit test)', () => {
  let calculateQuoteUseCase: CalculateQuoteUseCase
  let offersRepository: OffersRepository
  let freteRapidoService: FreteRapidoService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UnitTestModule],
    }).compile()

    offersRepository = moduleRef.get<OffersRepository>(OffersRepository)
    freteRapidoService = moduleRef.get<FreteRapidoService>(FreteRapidoService)

    calculateQuoteUseCase = moduleRef.get<CalculateQuoteUseCase>(
      CalculateQuoteUseCase,
    )
  })

  it('Should return all quote offers for a delivery', async () => {
    const spyOffersRepository = vi.spyOn(offersRepository, 'create')
    const spyFreteRapidoService = vi.spyOn(
      freteRapidoService,
      'fetchQuoteOffers',
    )

    const zipcode = '01311000'
    const volumes = [
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
    ]

    const offers = await calculateQuoteUseCase.handle(zipcode, volumes)

    expect(spyOffersRepository).toHaveBeenCalledTimes(8)
    expect(spyFreteRapidoService).toHaveBeenCalledOnce()

    expect(offers).toEqual([
      {
        carrier: 'JADLOG',
        service: '.PACKAGE',
        deadline: 13,
        price: 35.99,
      },
      { carrier: 'CORREIOS', service: 'PAC', deadline: 15, price: 44.96 },
      { carrier: 'CORREIOS', service: 'SEDEX', deadline: 11, price: 74.17 },
      {
        carrier: 'BTU BRASPRESS',
        service: 'Normal',
        deadline: 15,
        price: 93.35,
      },
      { carrier: 'CORREIOS', service: 'PAC', deadline: 15, price: 112.96 },
      {
        carrier: 'CORREIOS',
        service: 'SEDEX',
        deadline: 11,
        price: 205.54,
      },
      {
        carrier: 'PRESSA FR (TESTE)',
        service: 'Normal',
        deadline: 11,
        price: 1599.39,
      },
      {
        carrier: 'PRESSA FR (TESTE)',
        service: 'Normal',
        deadline: 11,
        price: 1599.39,
      },
    ])
  })
})
