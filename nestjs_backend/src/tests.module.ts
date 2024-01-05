import { Module } from '@nestjs/common'

import { e2eTestModuleConfig, unitTestModuleConfig } from './app.module.config'

@Module(unitTestModuleConfig)
export class UnitTestModule {}

@Module(e2eTestModuleConfig)
export class E2eTestModule {}
