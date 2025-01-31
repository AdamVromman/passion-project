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
  { year: 1917 },
  { year: 1918 },
  { year: 1919 },
  { year: 1920 },
  { year: 1921 },
  { year: 1922 },
  { year: 1923 },
  { year: 1924 },
  { year: 1925 },
  { year: 1926 },
  { year: 1927 },
  { year: 1928 },
  { year: 1929 },
  { year: 1930 },
  { year: 1931 },
  { year: 1932 },
  { year: 1933 },
  { year: 1934 },
  { year: 1935 },
  { year: 1936 },
  { year: 1937 },
  { year: 1938 },
  { year: 1939 },
  { year: 1940 },
  { year: 1941 },
  { year: 1942 },
  { year: 1943 },
  { year: 1944 },
  { year: 1945 },
  { year: 1946 },
  { year: 1947 },
  { year: 1948 },
  { year: 1949 },
  { year: 1950 },
  { year: 1951 },
  { year: 1952 },
  { year: 1953 },
  { year: 1954 },
  { year: 1955 },
  { year: 1956 },
  { year: 1957 },
  { year: 1958 },
  { year: 1959 },
  { year: 1960 },
  { year: 1961 },
  { year: 1962 },
  { year: 1963 },
  { year: 1964 },
  { year: 1965 },
  { year: 1966 },
  { year: 1967 },
  { year: 1968 },
  { year: 1969 },
  { year: 1970 },
  { year: 1971 },
  { year: 1972 },
  { year: 1973 },
  { year: 1974 },
  { year: 1975 },
  { year: 1976 },
  { year: 1977 },
  { year: 1978 },
  { year: 1979 },
  { year: 1980 },
  { year: 1981 },
  { year: 1982 },
  { year: 1983 },
  { year: 1984 },
  { year: 1985 },
  { year: 1986 },
  { year: 1987 },
  { year: 1988 },
  { year: 1989 },
  { year: 1990 },
  { year: 1991 },
  { year: 1992 },
  { year: 1993 },
  { year: 1994 },
  { year: 1995 },
  { year: 1996 },
  { year: 1997 },
  { year: 1998 },
  { year: 1999 },
  { year: 2000 },
  { year: 2001 },
  { year: 2002 },
  { year: 2003 },
  { year: 2004 },
  { year: 2005 },
  { year: 2006 },
  { year: 2007 },
  {
    year: 2008,
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
  {
    year: 2009,
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
  {
    year: 2010,
  },
  {
    year: 2011,
  },
  {
    year: 2012,
  },
  {
    year: 2013,
  },
  {
    year: 2014,
  },
  {
    year: 2015,
  },
  {
    year: 2016,
  },
  {
    year: 2017,
  },
  {
    year: 2018,
  },
  {
    year: 2019,
  },
  {
    year: 2020,
  },
  {
    year: 2021,
  },
  {
    year: 2022,
  },
  {
    year: 2023,
  },
  {
    year: 2024,
  },
  {
    year: 2025,
  },
];
