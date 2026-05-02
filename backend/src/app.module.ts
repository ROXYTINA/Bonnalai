import { Module } from '@nestjs/common';
import {SupabaseModule} from "./supabase/supabase.module.js";
import { DocumentsModule } from './documents/documents.module.js';
import { YearsModule } from './years/years.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';

@Module({
  imports: [
      SupabaseModule,
    SubjectsModule,
    YearsModule,
    DocumentsModule,
  ],
})
export class AppModule {}

