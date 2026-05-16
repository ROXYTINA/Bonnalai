import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller.js';
import { SubjectsService } from './subjects.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SubjectsModule {}
