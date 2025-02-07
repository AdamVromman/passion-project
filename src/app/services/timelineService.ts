import { SelectableDataType } from "./types";

export enum Source {
  OCHA = "OCHA",
  BTSELEM = "B'Tselem",
  CBS = "Israel Central Bureau of Statistics",
  AL_JAZEERA = "Al Jazeera",
  UNHCR = "UNHCR",
  MOHTEL = "Gaza's Ministry of Health Telegram channel",
  UNICEF = "UNICEF",
  UNRWA = "UNRWA",
  WIKIPEDIA = "Wikipedia",
  INTERACTIVE_ENCYCLOPEDIA_OF_PALESTINE_QUESTION = "Interactive Encyclopedia Of the Palestine Question",
  MIDDLE_EAST_EYE = "Middle East Eye",
  UNIVERSITY_OF_MICHIGAN = "University of Michigan",
  UN = "United Nations",
}

export interface DataEvent {
  name: string;
  arabicName?: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  link: string;
  source: Source[];
}

export interface DataNumber {
  number: number;
  source: Source[];
  note?: string;
}

export interface TimelineYear {
  year: number;
  adultsKilled?: DataNumber;
  adultsImprisoned?: DataNumber;
  minorsKilled?: DataNumber;
  minorsImprisoned?: DataNumber;
  adultsInjured?: DataNumber;
  minorsInjured?: DataNumber;
  illegalSettlers?: DataNumber;
  buildingsDemolished?: DataNumber;
  palestiniansDisplaced?: DataNumber;
  percentageOfPalestinianLandStolen?: DataNumber;
}

export interface DataPeriod {
  startYear: number;
  endYear: number;
  amount: DataNumber;
}

export const events: DataEvent[] = [
  {
    name: "The Balfour Declaration",
    description:
      "The Balfour declaration was the open support of the establishment of a Jewish state and the promise of that land being Palestine. The declaration was made by the British Foreign Secretary Arthur Balfour in a letter to Lord Rothschild, a leader of the British Jewish community.",
    date: new Date("1917-11-02"),
    location: "The United Kingdom",
    link: "https://www.aljazeera.com/features/2018/11/2/more-than-a-century-on-the-balfour-declaration-explained",
    source: [Source.AL_JAZEERA, Source.MIDDLE_EAST_EYE, Source.CBS],
  },
  {
    name: "The British Mandate",
    description:
      "During the first world war, Great Britain promised the Arabs independence in return for their support in fighting the Ottoman Empire. However, after the war was over, the British and French divided the Middle East between themselves and called these territories mandates. Palestine was one of these mandates.",
    date: new Date("1920-07-01"),
    endDate: new Date("1948-05-15"),
    location: "Palestine and Transjordan",
    link: "https://lsa.umich.edu/content/dam/cmenas-assets/cmenas-documents/unit-of-israel-palestine/Section1_BritishMandateInPalestine.pdf",
    source: [Source.UNIVERSITY_OF_MICHIGAN],
  },

  {
    name: "The Nakba",
    arabicName: "النَّكْبَة",
    description:
      "The Nakba (The Great Catastrophe) is the term used by Palestinians to describe the ethnic cleansing campaign that took place after Israel declared independence and the British mandate ended. During these months, over 750,000 Palestinians were expelled from their homes through massacres, bombings and psychological warfare. In total, 15,000 people were killed and over 500 villages were destroyed.",
    date: new Date("1947-12-01"),
    endDate: new Date("1949-07-20"),
    location: "Palestine",
    link: "https://www.middleeasteye.net/news/israel-palestine-nakba-ethnic-cleansing-explained-five-maps-charts",
    source: [Source.AL_JAZEERA, Source.MIDDLE_EAST_EYE, Source.CBS],
  },
  {
    name: "The United Nations Partition Plan",
    description:
      "With resolution 181, also know as the United Nations Partition Plan, the UN decided to partition Palestine into two separate states, one Jewish and one Arab. The Jewish state would receive 55% of the land and the Arab state would receive 45%. Jerusalem would remain under international control.",
    date: new Date("1947-11-29"),
    location: "New York City",
    link: "https://www.un.org/unispal/data-collection/general-assembly/",
    source: [Source.AL_JAZEERA, Source.UN],
  },
  {
    name: "The Suez Crisis",
    description: "",
    date: new Date("1956-10-29"),
    endDate: new Date("1956-11-07"),
  },
  {
    name: "Creation of the Palestinian Liberation Organization",
    description: "",
    date: new Date("1964-05-28"),
  },
  {
    name: "The Six-Day War",
    description: "",
    date: new Date("1967-06-05"),
    endDate: new Date("1967-06-10"),
  },
  {
    name: "The War of Attrition",
    description: "",
    date: new Date("1967-06-05"),
    endDate: new Date("1970-08-07"),
  },
  {
    name: "Munich Olympics Massacre",
    description: "",
    date: new Date("1972-09-05"),
  },
  {
    name: "The Yom Kippur War",
    description: "",
    date: new Date("1973-10-06"),
    endDate: new Date("1973-10-25"),
  },
  {
    name: "Camp David Accords",
    description: "",
    date: new Date("1978-09-17"),
  },
  {
    name: "The First Intifada",
    description: "",
    date: new Date("1987-12-08"),
    endDate: new Date("1993-09-13"),
  },
  {
    name: "The Oslo Accords",
    description: "",
    date: new Date("1993-09-13"),
  },
  {
    name: "The Second Intifada",
    description: "",
    date: new Date("2000-09-28"),
    endDate: new Date("2005-02-08"),
  },
];

//TODO: Displaced people
export const timeline: TimelineYear[] = [
  {
    year: 1917,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1918,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1919,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1920,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1921,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1922,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1923,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1924,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1925,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1926,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1927,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1928,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1929,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1930,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1931,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1932,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1933,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1934,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1935,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1936,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1937,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1938,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1939,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1940,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1941,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1942,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1943,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1944,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1945,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1946,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1947,
    percentageOfPalestinianLandStolen: {
      number: 0,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1948,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1949,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1950,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1951,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1952,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1953,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1954,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1955,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1956,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1957,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1958,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1959,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1960,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1961,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1962,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1963,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1964,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1965,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1966,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1967,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
    palestiniansDisplaced: { number: 325000, source: [Source.WIKIPEDIA] },
  },
  {
    year: 1968,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1969,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1970,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1971,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1972,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1973,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1974,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1975,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1976,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1977,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1978,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1979,
    percentageOfPalestinianLandStolen: {
      number: 78,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1980,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1981,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1982,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1983,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1984,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1985,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1986,
    illegalSettlers: { number: 60766, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1987,
    illegalSettlers: { number: 67483, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1988,
    adultsKilled: {
      number: 289 - 48 + 15 - 2 + 1 + 5,
      source: [Source.BTSELEM],
    },
    minorsKilled: { number: 50, source: [Source.BTSELEM] },
    illegalSettlers: { number: 190953, source: [Source.CBS] },
    buildingsDemolished: { number: 125, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1989,
    adultsKilled: {
      number: 285 - 78 + 17 - 5 + 1 + 2,
      source: [Source.BTSELEM],
    },
    minorsKilled: { number: 78 + 5, source: [Source.BTSELEM] },
    illegalSettlers: { number: 202885, source: [Source.CBS] },
    buildingsDemolished: { number: 144, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1990,
    adultsKilled: {
      number: 125 - 23 + 9 - 2 + 1 + 10,
      source: [Source.BTSELEM],
    },
    minorsKilled: { number: 23 + 2, source: [Source.BTSELEM] },
    illegalSettlers: { number: 221348, source: [Source.CBS] },
    buildingsDemolished: { number: 107, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1991,
    adultsKilled: { number: 91 - 24 + 6 - 3 + 5 + 2, source: [Source.BTSELEM] },
    minorsKilled: { number: 24 + 3, source: [Source.BTSELEM] },
    illegalSettlers: { number: 238060, source: [Source.CBS] },
    buildingsDemolished: { number: 46, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1992,
    adultsKilled: { number: 134 - 23 + 2 + 2, source: [Source.BTSELEM] },
    minorsKilled: { number: 23, source: [Source.BTSELEM] },
    illegalSettlers: { number: 252545, source: [Source.CBS] },
    buildingsDemolished: { number: 8, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1993,
    adultsKilled: {
      number: 124 + 30 - 36 - 4 + 5 + 8 - 1 + 7 + 2 + 4,
      source: [Source.BTSELEM],
    },
    minorsKilled: { number: 36 + 4 + 1, source: [Source.BTSELEM] },
    illegalSettlers: { number: 268756, source: [Source.CBS] },
    buildingsDemolished: { number: 1, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1994,
    adultsKilled: {
      number: 106 - 16 + 38 - 8 + 7 + 1,
      source: [Source.BTSELEM],
    },
    minorsKilled: { number: 16 + 8, source: [Source.BTSELEM] },
    illegalSettlers: { number: 285791, source: [Source.CBS] },
    buildingsDemolished: { number: 0, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1995,
    adultsKilled: { number: 52 - 4 + 2 - 1 + 1, source: [Source.BTSELEM] },
    minorsKilled: { number: 4 + 1, source: [Source.BTSELEM] },
    illegalSettlers: { number: 296959, source: [Source.CBS] },
    buildingsDemolished: { number: 0, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1996,
    adultsKilled: { number: 69 - 10 + 3 - 1 + 2, source: [Source.BTSELEM] },
    minorsKilled: { number: 10 + 1, source: [Source.BTSELEM] },
    illegalSettlers: { number: 313658, source: [Source.CBS] },
    buildingsDemolished: { number: 11, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1997,
    adultsKilled: { number: 18 - 5 + 4 + 1, source: [Source.BTSELEM] },
    minorsKilled: { number: 5, source: [Source.BTSELEM] },
    illegalSettlers: { number: 326053, source: [Source.CBS] },
    buildingsDemolished: { number: 6, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1998,
    adultsKilled: { number: 21 - 3 + 6 + 1, source: [Source.BTSELEM] },
    minorsKilled: { number: 3, source: [Source.BTSELEM] },
    illegalSettlers: { number: 341929, source: [Source.CBS] },
    buildingsDemolished: { number: 0, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1999,
    adultsKilled: { number: 8 + 1, source: [Source.BTSELEM] },
    minorsKilled: { number: 0, source: [Source.BTSELEM] },
    illegalSettlers: { number: 361150, source: [Source.CBS] },
    buildingsDemolished: { number: 0, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2000,
    adultsKilled: { number: 277 + 6, source: [Source.BTSELEM] },
    minorsKilled: { number: 86, source: [Source.BTSELEM] },
    illegalSettlers: { number: 379099, source: [Source.CBS] },
    buildingsDemolished: { number: 0, source: [Source.BTSELEM] },
    palestiniansDisplaced: { number: 5248185, source: [Source.UNRWA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2001,
    adultsKilled: { number: 463, source: [Source.BTSELEM] },
    minorsKilled: { number: 80, source: [Source.BTSELEM] },
    illegalSettlers: { number: 391049, source: [Source.CBS] },
    buildingsDemolished: { number: 10, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2002,
    adultsKilled: { number: 1021 + 13, source: [Source.BTSELEM] },
    minorsKilled: { number: 164 + 3, source: [Source.BTSELEM] },
    illegalSettlers: { number: 405149, source: [Source.CBS] },
    buildingsDemolished: { number: 251, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2003,
    adultsKilled: { number: 581 + 6, source: [Source.BTSELEM] },
    minorsKilled: { number: 121, source: [Source.BTSELEM] },
    illegalSettlers: { number: 421738, source: [Source.CBS] },
    buildingsDemolished: { number: 224, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2004,
    adultsKilled: { number: 827 + 2, source: [Source.BTSELEM] },
    minorsKilled: { number: 181 + 1, source: [Source.BTSELEM] },
    illegalSettlers: { number: 437681, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 177 + 1404, source: [Source.BTSELEM] },
  },
  {
    year: 2005,
    adultsKilled: { number: 183 + 7, source: [Source.BTSELEM] },
    minorsKilled: { number: 49 + 2, source: [Source.BTSELEM] },
    illegalSettlers: { number: 452622, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 17, source: [Source.BTSELEM] },
  },
  {
    year: 2006,
    adultsKilled: { number: 665, source: [Source.BTSELEM] },
    minorsKilled: { number: 140, source: [Source.BTSELEM] },
    illegalSettlers: { number: 470013, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 355 + 49, source: [Source.BTSELEM] },
  },
  {
    year: 2007,
    adultsKilled: { number: 384 + 1, source: [Source.BTSELEM] },
    minorsKilled: { number: 52, source: [Source.BTSELEM] },
    illegalSettlers: { number: 487618, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 43 + 41, source: [Source.BTSELEM] },
  },
  {
    year: 2008,
    adultsKilled: { number: 526, source: [Source.OCHA] },
    minorsKilled: { number: 345, source: [Source.OCHA] },
    adultsInjured: { number: 1536, source: [Source.OCHA] },
    minorsInjured: { number: 556, source: [Source.OCHA] },
    minorsImprisoned: { number: 379, source: [Source.BTSELEM] },
    adultsImprisoned: { number: 7952, source: [Source.BTSELEM] },
    illegalSettlers: { number: 496032, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    palestiniansDisplaced: { number: 342657, source: [Source.UNHCR] },
    buildingsDemolished: { number: 40 + 44, source: [Source.BTSELEM] },
  },
  {
    year: 2009,
    adultsKilled: { number: 956, source: [Source.OCHA] },
    minorsKilled: { number: 90, source: [Source.OCHA] },
    adultsInjured: { number: 4232, source: [Source.OCHA] },
    minorsInjured: { number: 2073, source: [Source.OCHA] },
    minorsImprisoned: { number: 299, source: [Source.BTSELEM] },
    adultsImprisoned: { number: 6842, source: [Source.BTSELEM] },
    illegalSettlers: { number: 514643, source: [Source.CBS] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    palestiniansDisplaced: { number: 342657, source: [Source.UNHCR] },
    buildingsDemolished: { number: 3 + 28, source: [Source.BTSELEM] },
  },
  {
    year: 2010,
    illegalSettlers: { number: 533022, source: [Source.CBS] },
    adultsKilled: { number: 78, source: [Source.OCHA] },
    minorsKilled: { number: 9, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 204 + 683 + 153 + 4662,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 180 + 30, source: [Source.BTSELEM] },
    adultsInjured: { number: 1211, source: [Source.OCHA] },
    minorsInjured: { number: 342, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 13 + 85, source: [Source.BTSELEM] },
  },
  {
    year: 2011,
    illegalSettlers: { number: 552260, source: [Source.CBS] },
    adultsKilled: { number: 103, source: [Source.OCHA] },
    minorsKilled: { number: 14, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 307 + 625 + 152 + 3196,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 113 + 19, source: [Source.BTSELEM] },
    adultsInjured: { number: 1701, source: [Source.OCHA] },
    minorsInjured: { number: 442, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 2 + 157, source: [Source.BTSELEM] },
  },
  {
    year: 2012,
    illegalSettlers: { number: 569727, source: [Source.CBS] },
    adultsKilled: { number: 214, source: [Source.OCHA] },
    minorsKilled: { number: 45, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 178 + 1031 + 219 + 3089,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 170 + 23, source: [Source.BTSELEM] },
    adultsInjured: { number: 3578, source: [Source.OCHA] },
    minorsInjured: { number: 1082, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 270, source: [Source.BTSELEM] },
  },
  {
    year: 2013,
    illegalSettlers: { number: 588437, source: [Source.CBS] },
    adultsKilled: { number: 34, source: [Source.OCHA] },
    minorsKilled: { number: 5, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 150 + 1351 + 189 + 3078,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 140 + 14, source: [Source.BTSELEM] },
    adultsInjured: { number: 2741, source: [Source.OCHA] },
    minorsInjured: { number: 1251, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 420, source: [Source.BTSELEM] },
  },
  {
    year: 2014,
    illegalSettlers: { number: 606851, source: [Source.CBS] },
    adultsKilled: { number: 1760, source: [Source.OCHA] },
    minorsKilled: { number: 567, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 463 + 1511 + 206 + 10 + 3347,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 157 + 15, source: [Source.BTSELEM] },
    adultsInjured: { number: 12824, source: [Source.OCHA] },
    minorsInjured: { number: 4710, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 5 + 3 + 341, source: [Source.BTSELEM] },
  },
  {
    year: 2015,
    palestiniansDisplaced: { number: 5149742, source: [Source.UNRWA] },
    illegalSettlers: { number: 623835, source: [Source.CBS] },
    adultsKilled: { number: 144, source: [Source.OCHA] },
    minorsKilled: { number: 30, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 584 + 1740 + 297 + 3445,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 333 + 133 + 6, source: [Source.BTSELEM] },
    adultsInjured: { number: 11904, source: [Source.OCHA] },
    minorsInjured: { number: 2732, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 12 + 332, source: [Source.BTSELEM] },
  },
  {
    year: 2016,
    illegalSettlers: { number: 640442, source: [Source.CBS] },
    adultsKilled: { number: 71, source: [Source.OCHA] },
    minorsKilled: { number: 37, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 535 + 1594 + 253 + 3561,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 225 + 70 + 1, source: [Source.BTSELEM] },
    adultsInjured: { number: 2416, source: [Source.OCHA] },
    minorsInjured: { number: 1048, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 28 + 5 + 654, source: [Source.BTSELEM] },
  },
  {
    year: 2017,
    illegalSettlers: { number: 657993, source: [Source.CBS] },
    adultsKilled: { number: 63, source: [Source.OCHA] },
    minorsKilled: { number: 14, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 437 + 1763 + 318 + 3458,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 301 + 92 + 2, source: [Source.BTSELEM] },
    adultsInjured: { number: 4679, source: [Source.OCHA] },
    minorsInjured: { number: 1209, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 7 + 1 + 208, source: [Source.BTSELEM] },
  },
  {
    year: 2018,
    illegalSettlers: { number: 675695, source: [Source.CBS] },
    adultsKilled: { number: 243, source: [Source.OCHA] },
    minorsKilled: { number: 57, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 494 + 1429 + 240 + 3207,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 170 + 60 + 2, source: [Source.BTSELEM] },
    adultsInjured: { number: 22189, source: [Source.OCHA] },
    minorsInjured: { number: 6428, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 9 + 7 + 195, source: [Source.BTSELEM] },
  },
  {
    year: 2019,
    illegalSettlers: { number: 692402, source: [Source.CBS] },
    adultsKilled: { number: 111, source: [Source.OCHA] },
    minorsKilled: { number: 27, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 464 + 1027 + 197 + 2855,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 160 + 26 + 4, source: [Source.BTSELEM] },
    adultsInjured: { number: 8635, source: [Source.OCHA] },
    minorsInjured: { number: 5557, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 14 + 261, source: [Source.BTSELEM] },
  },
  {
    year: 2020,
    illegalSettlers: { number: 703874, source: [Source.CBS] },
    adultsKilled: { number: 21, source: [Source.OCHA] },
    minorsKilled: { number: 9, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 355 + 1026 + 161 + 2643,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 144 + 25 + 2, source: [Source.BTSELEM] },
    adultsInjured: { number: 1792, source: [Source.OCHA] },
    minorsInjured: { number: 424, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 6 + 569, source: [Source.BTSELEM] },
  },
  {
    year: 2021,
    illegalSettlers: { number: 719452, source: [Source.CBS] },
    adultsKilled: { number: 250, source: [Source.OCHA] },
    minorsKilled: { number: 78, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 495 + 1007 + 103 + 2413,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 108 + 33 + 5, source: [Source.BTSELEM] },
    adultsInjured: { number: 6591, source: [Source.OCHA] },
    minorsInjured: { number: 2132, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 3 + 1 + 683, source: [Source.BTSELEM] },
  },
  {
    year: 2022,
    adultsKilled: { number: 146, source: [Source.OCHA] },
    minorsKilled: { number: 44, source: [Source.OCHA] },
    adultsInjured: { number: 4173, source: [Source.OCHA] },
    minorsInjured: { number: 1085, source: [Source.OCHA] },
    adultsImprisoned: {
      number: 784 + 1090 + 105 + 2262,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 105 + 14 + 7, source: [Source.BTSELEM] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 17 + 784, source: [Source.BTSELEM] },
  },
  {
    year: 2023,
    adultsKilled: { number: 21822 + 411, source: [Source.OCHA, Source.MOHTEL] },
    minorsKilled: { number: 126 + 9100, source: [Source.OCHA, Source.MOHTEL] },
    adultsImprisoned: {
      number: 3242 + 1629 + 626 + 432 + 1917,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 128 + 49, source: [Source.BTSELEM] },
    adultsInjured: {
      number: 4440 + 56451,
      source: [Source.OCHA, Source.MOHTEL],
    },
    minorsInjured: {
      number: 2002 + 6720,
      source: [Source.OCHA, Source.UNICEF],
    },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 31 + 16 + 554, source: [Source.BTSELEM] },
  },
  {
    year: 2024,
    adultsKilled: {
      number: 23719 + 400,
      source: [Source.OCHA, Source.MOHTEL],
      note: "Due to the ongoing genocide in Palestine, these numbers might be heavily underestimated.",
    },
    minorsKilled: { number: 92 + 8718, source: [Source.OCHA, Source.MOHTEL] },
    adultsImprisoned: {
      number: 3340 + 2093 + 849 + 333 + 1829,
      source: [Source.BTSELEM],
    },
    minorsImprisoned: { number: 183 + 61, source: [Source.BTSELEM] },
    adultsInjured: {
      number: 1190 + 51887,
      source: [Source.OCHA, Source.MOHTEL],
    },
    minorsInjured: { number: 613 + 6720, source: [Source.OCHA, Source.UNICEF] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
    buildingsDemolished: { number: 841 + 20, source: [Source.BTSELEM] },
  },
  {
    year: 2025,
    adultsKilled: { number: 1919 + 22, source: [Source.MOHTEL, Source.OCHA] },
    minorsKilled: { number: 42 + 6, source: [Source.MOHTEL, Source.OCHA] },
    adultsInjured: {
      number: 3242 + 175,
      source: [Source.MOHTEL, Source.OCHA],
    },
    minorsInjured: { number: 40 + 560, source: [Source.OCHA, Source.UNICEF] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
];

export const periods = new Map<SelectableDataType, DataPeriod[]>([
  [
    SelectableDataType.ADULTS_KILLED,
    [
      {
        startYear: 1917,
        endYear: 1946,
        amount: {
          number:
            5 +
            4 +
            48 +
            116 +
            5000 +
            720 +
            16 +
            4 +
            21 +
            314 +
            33 +
            5 +
            20 +
            7 +
            4 +
            41,
          source: [Source.WIKIPEDIA],
        },
      },
      {
        startYear: 1947,
        endYear: 1948,
        amount: { number: 15000, source: [Source.AL_JAZEERA] },
      },
      {
        startYear: 1949,
        endYear: 1966,
        amount: {
          number: 5000 + 5000,
          source: [Source.AL_JAZEERA, Source.WIKIPEDIA],
        },
      },
      {
        startYear: 1967,
        endYear: 1982,
        amount: {
          number: 1000 + 156 + 3500 + 1000 + 2000,
          source: [Source.AL_JAZEERA],
        },
      },
    ],
  ],
  [
    SelectableDataType.ADULTS_IMPRISONED,
    [
      {
        startYear: 1947,
        endYear: 1948,
        amount: { number: 12000, source: [Source.AL_JAZEERA] },
      },
      {
        startYear: 1967,
        endYear: 1999,
        amount: {
          number:
            1000000 -
            timeline
              .filter((d) => d.year >= 2008 && d.year <= 2019)
              .map(
                (d) =>
                  (d.adultsImprisoned?.number ?? 0) +
                  (d.minorsImprisoned?.number ?? 0)
              )
              .reduce((a, b) => a + b, 0) -
            90000,
          source: [Source.INTERACTIVE_ENCYCLOPEDIA_OF_PALESTINE_QUESTION],
        },
      },
      {
        startYear: 2000,
        endYear: 2008,
        amount: {
          number:
            80000 -
            timeline
              .filter((d) => d.year >= 2008 && d.year <= 2019)
              .map((d) => d.adultsImprisoned?.number ?? 0)
              .reduce((a, b) => a + b, 0),
          source: [Source.INTERACTIVE_ENCYCLOPEDIA_OF_PALESTINE_QUESTION],
        },
      },
    ],
  ],
  [
    SelectableDataType.MINORS_IMPRISONED,
    [
      {
        startYear: 2000,
        endYear: 2008,
        amount: {
          number:
            11000 -
            timeline
              .filter((d) => d.year >= 2008 && d.year <= 2019)
              .map((d) => d.minorsImprisoned?.number ?? 0)
              .reduce((a, b) => a + b, 0),
          source: [Source.INTERACTIVE_ENCYCLOPEDIA_OF_PALESTINE_QUESTION],
        },
      },
    ],
  ],
  [
    SelectableDataType.ILLEGAL_SETTLERS,
    [
      {
        startYear: 1948,
        endYear: 1971,
        amount: { number: 2810, source: [Source.WIKIPEDIA] },
      },
      {
        startYear: 1972,
        endYear: 1976,
        amount: { number: 10531 + 77, source: [Source.WIKIPEDIA] },
      },
      {
        startYear: 1977,
        endYear: 1983,
        amount: { number: 99795 + 6800, source: [Source.WIKIPEDIA] },
      },
    ],
  ],
  [
    SelectableDataType.PALESTINIANS_DISPLACED,
    [
      {
        startYear: 1947,
        endYear: 1948,
        amount: { number: 700000, source: [Source.WIKIPEDIA] },
      },
      {
        startYear: 1949,
        endYear: 1956,
        amount: { number: 40000, source: [Source.WIKIPEDIA] },
      },
    ],
  ],
]);
