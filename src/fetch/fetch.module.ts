import { Module } from '@nestjs/common';
import { FetchController } from './fetch.controller';
import { HttpClientModule } from '../httpclient/httpclient.module';

@Module({
  imports: [HttpClientModule],
  controllers: [FetchController]
})
export class FetchModule {}
