
export  enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface StoreHours {
  open: string | null;
  close: string | null;
}

export const hoursByDay: Record<DayOfWeek, StoreHours> = {
      [DayOfWeek.SUNDAY]: { open: '11:00', close: '23:00' },
      [DayOfWeek.MONDAY]: { open: '12:00', close: '23:00' },
      [DayOfWeek.TUESDAY]: { open: '12:00', close: '23:00' },
      [DayOfWeek.WEDNESDAY]: { open: '12:00', close: '23:00' },
      [DayOfWeek.THURSDAY]: { open: '12:00', close: '23:00' },
      [DayOfWeek.FRIDAY]: { open: '12:00', close: '23:00' },
      [DayOfWeek.SATURDAY]: { open: '11:00', close: '23:00' }
  };

export enum StoreState {
  OPEN = 'Open',
  CLOSING_SOON = 'Closing Soon',
  OPENING_SOON = 'Opening Soon',
  CLOSED = 'Closed'
}

export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function getCurrentTimeInShelbyvilleKy(): Date {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };
  const timeString = now.toLocaleTimeString('en-US', options);
  const [hour, minute, second] = timeString.split(':').map(Number);
  const shelbyvilleTime = new Date(now);
  shelbyvilleTime.setHours(hour, minute, second, 0);
  return shelbyvilleTime;
}

export function getStoreState(): StoreState {    
    const currentTimeInShelbyvilleKy = getCurrentTimeInShelbyvilleKy();
    const currentDay = currentTimeInShelbyvilleKy.getDay() as DayOfWeek;
    const storeHours = hoursByDay[currentDay];
    
    const [startHourNum, startMinute] = (storeHours.open ?? '00:00').split(':').map(Number);
    const [endHourNum, endMinute] = (storeHours.close ?? '00:00').split(':').map(Number);

    const current = currentTimeInShelbyvilleKy.getHours() * 60 + currentTimeInShelbyvilleKy.getMinutes();
    const start = startHourNum * 60 + startMinute;
    const end = endHourNum * 60 + endMinute;

    const startingSoonStart = start - 60;
    const closingSoonStart = end - 60;

    if (current >= startingSoonStart && current < start) {
        return StoreState.OPENING_SOON;
    }

    if (current < start || current >= end) {
        return StoreState.CLOSED;
    }

    if (current >= closingSoonStart) {
        return StoreState.CLOSING_SOON; 
    }

    return StoreState.OPEN;
}


