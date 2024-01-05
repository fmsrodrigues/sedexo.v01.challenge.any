import { Test } from '@nestjs/testing'

import { FetchQuoteMetricsUseCase } from './fetch-quote-metrics.use-case'
import { OffersRepository } from '@/repositories/offers/offers.interface'
import { UnitTestModule } from '@/tests.module'

describe('FetchQuoteMetricsUseCase (Unit test)', () => {
  let fetchQuoteMetricsUseCase: FetchQuoteMetricsUseCase
  let offersRepository: OffersRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UnitTestModule],
    }).compile()

    offersRepository = moduleRef.get<OffersRepository>(OffersRepository)

    fetchQuoteMetricsUseCase = moduleRef.get<FetchQuoteMetricsUseCase>(
      FetchQuoteMetricsUseCase,
    )

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

  it('Should return metrics from the latest 3 quotes', async () => {
    const spyFindUniqueQuotes = vi.spyOn(offersRepository, 'findUniqueQuotes')
    const spyFindByQuotes = vi.spyOn(offersRepository, 'findByQuotes')

    const metrics = await fetchQuoteMetricsUseCase.handle(3)

    expect(spyFindUniqueQuotes).toHaveBeenCalledOnce()
    expect(spyFindUniqueQuotes).toHaveBeenCalledWith(3)
    expect(spyFindUniqueQuotes).toHaveReturnedWith([
      'quote 9',
      'quote 8',
      'quote 7',
    ])

    expect(spyFindByQuotes).toHaveBeenCalledOnce()

    expect(metrics).toEqual({
      carriersMetrics: [
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
      cheapestOffer: 17,
      mostExpensiveOffer: 19,
    })
  })

  it('Should return all metrics', async () => {
    const spyFindUniqueQuotes = vi.spyOn(offersRepository, 'findUniqueQuotes')
    const spyFindByQuotes = vi.spyOn(offersRepository, 'findByQuotes')

    const metrics = await fetchQuoteMetricsUseCase.handle()

    expect(spyFindUniqueQuotes).toHaveBeenCalledOnce()
    expect(spyFindUniqueQuotes).toHaveBeenCalledWith(undefined)
    expect(spyFindUniqueQuotes).toHaveReturnedWith([
      'quote 9',
      'quote 8',
      'quote 7',
      'quote 6',
      'quote 5',
      'quote 4',
      'quote 3',
      'quote 2',
      'quote 1',
      'quote 0',
    ])

    expect(spyFindByQuotes).toHaveBeenCalledOnce()

    console.log(metrics)

    expect(metrics).toEqual({
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
})
