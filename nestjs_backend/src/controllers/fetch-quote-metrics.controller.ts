import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { FetchQuoteMetricsUseCase } from '@/use-cases/fetch-quote-metrics.use-case'

const quoteAmountQueryParamsSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()

const queryValidationPipe = new ZodValidationPipe(quoteAmountQueryParamsSchema)

type QuoteAmountQueryParamsSchema = z.infer<typeof quoteAmountQueryParamsSchema>

@Controller('/metrics')
export class FetchQuoteMetricsController {
  constructor(private fetchQuoteMetricsUseCase: FetchQuoteMetricsUseCase) {}

  @Get()
  async handle(
    @Query('last_quotes', queryValidationPipe)
    quoteAmount: QuoteAmountQueryParamsSchema,
  ) {
    const metrics = this.fetchQuoteMetricsUseCase.handle(quoteAmount)
    return metrics
  }
}
