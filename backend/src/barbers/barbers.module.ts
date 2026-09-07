import { Module } from '@nestjs/common';
import { BarbersController } from './controllers/barbers.controller.js';
import { BarbersService } from './services/barbers.service.js';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BarbersController],
  providers: [BarbersService],
  exports: [BarbersService],
})
export class BarbersModule {}
