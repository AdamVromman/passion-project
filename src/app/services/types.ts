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
