import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

import { CalculateQuoteUseCase } from '@/use-cases/calculate-quote.use-case'

const calculateQuoteBodySchema = z.object({
  recipient: z.object({
    address: z.object({
      zipcode: z.string().length(8),
    }),
  }),

  volumes: z.array(
    z.object({
      category: z.number().int().positive(),
      amount: z.number().int().positive(),
      unitary_weight: z.number().positive(),
      price: z.number().int().positive(),
      sku: z.string().optional(),
      height: z.number().positive(),
      width: z.number().positive(),
      length: z.number().positive(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(calculateQuoteBodySchema)

type CalculateQuoteBodySchema = z.infer<typeof calculateQuoteBodySchema>

@Controller('/quote')
export class CalculateQuoteController {
  constructor(private calculateQuoteUseCase: CalculateQuoteUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CalculateQuoteBodySchema) {
    const { recipient, volumes } = body
    const recipientZipcode = recipient.address.zipcode

    try {
      const quotes = await this.calculateQuoteUseCase.handle(
        recipientZipcode,
        volumes,
      )

      const carrierQuotes = quotes.map((quote) => ({
        name: quote.carrier,
        service: quote.service,
        deadline: quote.deadline,
        price: quote.price,
      }))

      return { carrier: carrierQuotes }
    } catch (err) {
      return new InternalServerErrorException('Failed to calculate quote')
    }
  }
}
