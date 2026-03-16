import { Module } from '@nestjs/common';
import { SerializeController } from './serialize.controller';

@Module({
  controllers: [SerializeController]
})
export class SerializeModule {}
