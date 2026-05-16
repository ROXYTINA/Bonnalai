import { Module } from '@nestjs/common';
import { YearsController } from './years.controller.js';
import { YearsService } from './years.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [YearsController],
  providers: [YearsService]
})
export class YearsModule {}
