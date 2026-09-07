export class Booking {
  id!: string;
  barberId!: string;
  customerEmail!: string;
  startTime!: Date;
  endTime!: Date;
  createdAt!: Date;

  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);

    if (partial.startTime && !(partial.startTime instanceof Date)) {
      this.startTime = new Date(partial.startTime);
    }
    if (partial.endTime && !(partial.endTime instanceof Date)) {
      this.endTime = new Date(partial.endTime);
    }
    if (partial.createdAt && !(partial.createdAt instanceof Date)) {
      this.createdAt = new Date(partial.createdAt);
    }
  }

  overlapsWith(otherStart: Date, otherEnd: Date): boolean {
    return this.startTime < otherEnd && this.endTime > otherStart;
  }
}
