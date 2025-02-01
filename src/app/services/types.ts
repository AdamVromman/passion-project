export interface DailyData {
  gazaKilled: number;
  gazaInjured: number;
  westBankKilled: number;
  westBankInjured: number;
}

export interface GazaData {
  report_date: string;
  killed: number;
  injured: number;
}

export interface WestBankData {
  report_date: string;
  verified: {
    killed: number;
    injured: number;
  };
  killed_cum: number;
  injured_cum: number;
}

export interface EyeLineElement {
  color: string;
  rotation: number;
  duration: number;
  size: number;
}

export enum SelectableDataType {
  ADULTS_KILLED = "adults-killed",
  ADULTS_IMPRISONED = "adults-imprisoned",
  MINORS_KILLED = "minors-killed",
  MINORS_IMPRISONED = "minors-imprisoned",
  ADULTS_INJURED = "adults-injured",
  MINORS_INJURED = "minors-injured",
  ILLEGAL_SETTLERS = "illegal-settlers",
  BUILDINGS_DEMOLISHED = "buildings-demolished",
  PALESTINIANS_DISPLACED = "palestinians-displaced",
  PERCENTAGE_OF_PALESTINIAN_LAND_STOLEN = "percentage-of-palestinian-land-stolen",
}
