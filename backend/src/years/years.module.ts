import { Module } from '@nestjs/common';
import { YearsController } from './years.controller.js';
import { YearsService } from './years.service.js';

@Module({
  controllers: [YearsController],
  providers: [YearsService]
})
export class YearsModule {}
