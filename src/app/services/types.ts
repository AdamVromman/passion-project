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
  ADULTS_KILLED = "adultsKilled",
  ADULTS_IMPRISONED = "adultsImprisoned",
  MINORS_KILLED = "minorsKilled",
  MINORS_IMPRISONED = "minorsImprisoned",
  ADULTS_INJURED = "adultsInjured",
  MINORS_INJURED = "minorsInjured",
  ILLEGAL_SETTLERS = "illegalSettlers",
  BUILDINGS_DEMOLISHED = "buildingsDemolished",
  PALESTINIANS_DISPLACED = "palestiniansDisplaced",
  PERCENTAGE_OF_PALESTINIAN_LAND_STOLEN = "percentageOfPalestinianLandStolen",
}

export interface LeftData {
  adultsKilled: boolean;
  adultsImprisoned: boolean;
  minorsKilled: boolean;
  minorsImprisoned: boolean;
  adultsInjured: boolean;
  minorsInjured: boolean;
}

export interface RightData {
  illegalSettlers: boolean;
  buildingsDemolished: boolean;
  palestiniansDisplaced: boolean;
  percentageOfPalestinianLandStolen: boolean;
}
