export interface WorkScheduleDay {
  start: string;
  end: string;
}

export interface WorkSchedule {
  monday?: WorkScheduleDay;
  tuesday?: WorkScheduleDay;
  wednesday?: WorkScheduleDay;
  thursday?: WorkScheduleDay;
  friday?: WorkScheduleDay;
  saturday?: WorkScheduleDay;
  sunday?: WorkScheduleDay;
}

export interface Barber {
  id: string;
  name: string;
  workSchedule: WorkSchedule;
}
