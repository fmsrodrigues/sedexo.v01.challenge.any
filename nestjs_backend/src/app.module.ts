import { Module } from '@nestjs/common'

import { appModuleConfig } from './app.module.config'

@Module(appModuleConfig)
export class AppModule {}
