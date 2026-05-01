import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AppController, TestController],
  providers: [AppService, TestService],
})
export class AppModule {}
