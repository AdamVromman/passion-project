export interface Event {
  name: string;
  arabicName: string;
  description: string;
  date: Date;
  location: string;
  link: string;
  source: string;
  image: string;
}

interface dataNumber {
  number: number;
  source: string;
}

export interface Timeline {
  [year: number]: {
    events: Event[];
    palestinianCasualties: dataNumber;
    israeliCasualties: dataNumber;
  };
}

export const timeline: Timeline = {};
