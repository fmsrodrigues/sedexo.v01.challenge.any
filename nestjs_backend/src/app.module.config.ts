import { ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'

import { CalculateQuoteController } from './controllers/calculate-quote.controller'
import { FetchQuoteMetricsController } from './controllers/fetch-quote-metrics.controller'

import { CalculateQuoteUseCase } from './use-cases/calculate-quote.use-case'
import { FetchQuoteMetricsUseCase } from './use-cases/fetch-quote-metrics.use-case'

// Dev & Prod dependencies
import { PrismaService } from './services/prisma/prisma.service'
import { PrismaOffersRepository } from './repositories/offers/prisma-offers.repository'
import { OffersRepository } from './repositories/offers/offers.interface'

import { FreteRapidoService } from './services/frete-rapido/frete-rapido.interfaces'
import { FreteRapidoAPIService } from './services/frete-rapido/frete-rapido.service'

// Tests dependencies
import { InMemoryOffersRepository } from './repositories/offers/in-memory-offers.repository'
import { FreteRapidoMockService } from './services/frete-rapido/frete-rapido-mock.service'

const baseModuleConfig: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CalculateQuoteController, FetchQuoteMetricsController],
  providers: [
    // Use Cases
    CalculateQuoteUseCase,
    FetchQuoteMetricsUseCase,
  ],
}

export const appModuleConfig = {
  ...baseModuleConfig,
  providers: [
    ...baseModuleConfig.providers!,
    PrismaService,
    { provide: OffersRepository, useClass: PrismaOffersRepository },
    { provide: FreteRapidoService, useClass: FreteRapidoAPIService },
  ],
}

export const unitTestModuleConfig = {
  ...baseModuleConfig,
  providers: [
    ...baseModuleConfig.providers!,
    PrismaService,
    { provide: OffersRepository, useClass: InMemoryOffersRepository },
    { provide: FreteRapidoService, useClass: FreteRapidoMockService },
  ],
}

export const e2eTestModuleConfig = {
  ...baseModuleConfig,
  providers: [
    ...baseModuleConfig.providers!,
    PrismaService,
    { provide: OffersRepository, useClass: PrismaOffersRepository },
    { provide: FreteRapidoService, useClass: FreteRapidoMockService },
  ],
}
