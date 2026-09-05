import { Module } from '@nestjs/common';
import { BarbersController } from './barbers.controller.js';
import { BarbersService } from './barbers.service.js';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BarbersController],
  providers: [BarbersService],
  exports: [BarbersService],
})
export class BarbersModule {}
