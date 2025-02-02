export enum Source {
  OCHA = "OCHA",
  BTSELEM = "B'Tselem",
  CBS = "Israel Central Bureau of Statistics",
  AL_JAZEERA = "Al Jazeera",
  UNHCR = "UNHCR",
  MOHTEL = "Gaza's Ministry of Health Telegram channel",
  UNICEF = "UNICEF",
}

export interface Event {
  name: string;
  arabicName: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  link: string;
  source: Source[];
  image: string;
}

interface dataNumber {
  number: number;
  source: Source[];
}

export interface TimelineYear {
  year: number;
  events?: Event[];
  adultsKilled?: dataNumber;
  adultsImprisoned?: dataNumber;
  minorsKilled?: dataNumber;
  minorsImprisoned?: dataNumber;
  adultsInjured?: dataNumber;
  minorsInjured?: dataNumber;
  illegalSettlers?: dataNumber;
  buildingsDemolished?: dataNumber;
  palestiniansDisplaced?: dataNumber;
  percentageOfPalestinianLandStolen?: dataNumber;
}

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
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1987,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1988,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1989,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1990,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1991,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1992,
    percentageOfPalestinianLandStolen: {
      number: 78.5,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1993,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1994,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1995,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1996,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1997,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1998,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 1999,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2000,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2001,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2002,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2003,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2004,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2005,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2006,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2007,
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
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
    buildingsDemolished: { number: 84, source: [Source.BTSELEM] },
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
    buildingsDemolished: { number: 31, source: [Source.BTSELEM] },
  },
  {
    year: 2010,
    adultsKilled: { number: 78, source: [Source.OCHA] },
    minorsKilled: { number: 9, source: [Source.OCHA] },
    adultsInjured: { number: 1211, source: [Source.OCHA] },
    minorsInjured: { number: 342, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2011,
    adultsKilled: { number: 103, source: [Source.OCHA] },
    minorsKilled: { number: 14, source: [Source.OCHA] },
    adultsInjured: { number: 1701, source: [Source.OCHA] },
    minorsInjured: { number: 442, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2012,
    adultsKilled: { number: 214, source: [Source.OCHA] },
    minorsKilled: { number: 45, source: [Source.OCHA] },
    adultsInjured: { number: 3578, source: [Source.OCHA] },
    minorsInjured: { number: 1082, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2013,
    adultsKilled: { number: 34, source: [Source.OCHA] },
    minorsKilled: { number: 5, source: [Source.OCHA] },
    adultsInjured: { number: 2741, source: [Source.OCHA] },
    minorsInjured: { number: 1251, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2014,
    adultsKilled: { number: 1760, source: [Source.OCHA] },
    minorsKilled: { number: 567, source: [Source.OCHA] },
    adultsInjured: { number: 12824, source: [Source.OCHA] },
    minorsInjured: { number: 4710, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2015,
    adultsKilled: { number: 144, source: [Source.OCHA] },
    minorsKilled: { number: 30, source: [Source.OCHA] },
    adultsInjured: { number: 11904, source: [Source.OCHA] },
    minorsInjured: { number: 2732, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2016,
    adultsKilled: { number: 71, source: [Source.OCHA] },
    minorsKilled: { number: 37, source: [Source.OCHA] },
    adultsInjured: { number: 2416, source: [Source.OCHA] },
    minorsInjured: { number: 1048, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2017,
    adultsKilled: { number: 63, source: [Source.OCHA] },
    minorsKilled: { number: 14, source: [Source.OCHA] },
    adultsInjured: { number: 4679, source: [Source.OCHA] },
    minorsInjured: { number: 1209, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2018,
    adultsKilled: { number: 243, source: [Source.OCHA] },
    minorsKilled: { number: 57, source: [Source.OCHA] },
    adultsInjured: { number: 22189, source: [Source.OCHA] },
    minorsInjured: { number: 6428, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2019,
    adultsKilled: { number: 111, source: [Source.OCHA] },
    minorsKilled: { number: 27, source: [Source.OCHA] },
    adultsInjured: { number: 8635, source: [Source.OCHA] },
    minorsInjured: { number: 5557, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2020,
    adultsKilled: { number: 21, source: [Source.OCHA] },
    minorsKilled: { number: 9, source: [Source.OCHA] },
    adultsInjured: { number: 1792, source: [Source.OCHA] },
    minorsInjured: { number: 424, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2021,
    adultsKilled: { number: 250, source: [Source.OCHA] },
    minorsKilled: { number: 78, source: [Source.OCHA] },
    adultsInjured: { number: 6591, source: [Source.OCHA] },
    minorsInjured: { number: 2132, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2022,
    adultsKilled: { number: 146, source: [Source.OCHA] },
    minorsKilled: { number: 44, source: [Source.OCHA] },
    adultsInjured: { number: 4173, source: [Source.OCHA] },
    minorsInjured: { number: 1085, source: [Source.OCHA] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
  },
  {
    year: 2023,
    adultsKilled: { number: 21822 + 411, source: [Source.OCHA, Source.MOHTEL] },
    minorsKilled: { number: 126 + 9100, source: [Source.OCHA, Source.MOHTEL] },
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
  },
  {
    year: 2024,
    adultsKilled: { number: 23719 + 400, source: [Source.OCHA, Source.MOHTEL] },
    minorsKilled: { number: 92 + 8718, source: [Source.OCHA, Source.MOHTEL] },
    adultsInjured: {
      number: 1190 + 51887,
      source: [Source.OCHA, Source.MOHTEL],
    },
    minorsInjured: { number: 613 + 6720, source: [Source.OCHA, Source.UNICEF] },
    percentageOfPalestinianLandStolen: {
      number: 90,
      source: [Source.AL_JAZEERA],
    },
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
