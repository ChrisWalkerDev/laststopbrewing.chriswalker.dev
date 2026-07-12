export interface StoreHoursEntry {
  day: string;
  hours: string;
}

export interface LocationPageViewModel {
  title: string;
  addressLines: readonly string[];
  hours: readonly StoreHoursEntry[];
}
