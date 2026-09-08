import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PastDateValidator {
  //  now param good for testing
  validate(startTime: Date, now: Date = new Date()): void {
    if (startTime < now) {
      throw new BadRequestException(
        'Múltbeli időpontra nem lehet foglalást létrehozni',
      );
    }
  }
}
