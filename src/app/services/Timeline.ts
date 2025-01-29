export enum Source {
  OCHA = "OCHA",
  BTSELEM = "B'Tselem",
  CBS = "Israel Central Bureau of Statistics",
  AL_JAZEERA = "Al Jazeera",
  UNHCR = "UNHCR",
}

export interface Event {
  name: string;
  arabicName: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  link: string;
  source: Source;
  image: string;
}

interface dataNumber {
  number: number;
  source: Source;
}

export interface TimelineData {
  [year: number]: {
    events?: Event[];
    adultsKilled: dataNumber;
    adultsImprisoned: dataNumber;
    minorsKilled: dataNumber;
    minorsImprisoned: dataNumber;
    adultsInjured: dataNumber;
    minorsInjured: dataNumber;
    illegalSettlers: dataNumber;
    buildingsDemolished: dataNumber;
    palestiniansDisplaced: dataNumber;
    percentageOfPalestinianLandStolen: dataNumber;
  };
}

export const timeline: TimelineData = {
  2008: {
    adultsKilled: { number: 526, source: Source.OCHA },
    minorsKilled: { number: 345, source: Source.OCHA },
    adultsInjured: { number: 1536, source: Source.OCHA },
    minorsInjured: { number: 556, source: Source.OCHA },
    minorsImprisoned: { number: 379, source: Source.BTSELEM },
    adultsImprisoned: { number: 7952, source: Source.BTSELEM },
    illegalSettlers: { number: 496032, source: Source.CBS },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: Source.AL_JAZEERA,
    },
    palestiniansDisplaced: { number: 342657, source: Source.UNHCR },
    buildingsDemolished: { number: 84, source: Source.BTSELEM },
  },
  2009: {
    adultsKilled: { number: 1482, source: Source.OCHA },
    minorsKilled: { number: 433, source: Source.OCHA },
    adultsInjured: { number: 5768, source: Source.OCHA },
    minorsInjured: { number: 2629, source: Source.OCHA },
    minorsImprisoned: { number: 299, source: Source.BTSELEM },
    adultsImprisoned: { number: 6842, source: Source.BTSELEM },
    illegalSettlers: { number: 514643, source: Source.CBS },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: Source.AL_JAZEERA,
    },
    palestiniansDisplaced: { number: 342657, source: Source.UNHCR },
    buildingsDemolished: { number: 31, source: Source.BTSELEM },
  },
};
