export interface Holding {
  id: string;
  n: string;
  t: 'mf' | 'eq';
  src: 'jm' | 'cams' | 'cdsl' | 'nsdl';
  cv: number;
  iv: number;
  g: number;
  gp: number;
  xi: number;
  hp: string;
  qty: number;
  p: number;
  sec: string;
  tax?: string;
  hasAl?: boolean;
}

export const JM: Holding[] = [
  { id: 'j1', n: 'JM Flexi Cap Fund — Direct Growth', t: 'mf', src: 'jm', cv: 3200000, iv: 2647224, g: 552776, gp: 20.9, xi: 18.4, hp: '10m 8d', qty: 84320, p: 37.92, sec: 'Multi-cap', tax: 'STCG', hasAl: true },
  { id: 'j2', n: 'Reliance Industries Ltd', t: 'eq', src: 'jm', cv: 3150000, iv: 2450000, g: 700000, gp: 28.6, xi: 24.1, hp: '8 months', qty: 1500, p: 2100, sec: 'Energy', hasAl: true },
  { id: 'j3', n: 'HDFC Bank Ltd', t: 'eq', src: 'jm', cv: 1850000, iv: 1704600, g: 145400, gp: 8.5, xi: 12.3, hp: '7 months', qty: 1200, p: 1541.67, sec: 'Financials', hasAl: true },
  { id: 'j4', n: 'JM Small Cap Fund — Direct Growth', t: 'mf', src: 'jm', cv: 1400000, iv: 1100000, g: 300000, gp: 27.3, xi: 22.1, hp: '14 months', qty: 28000, p: 50, sec: 'Small-cap' },
  { id: 'j5', n: 'Infosys Ltd', t: 'eq', src: 'jm', cv: 920000, iv: 760000, g: 160000, gp: 21.1, xi: 18.7, hp: '11 months', qty: 520, p: 1769.23, sec: 'Technology' },
];

export const EXT: Holding[] = [
  { id: 'e1', n: 'HDFC Large Cap Fund — Direct Growth', t: 'mf', src: 'cams', cv: 600000, iv: 500000, g: 100000, gp: 20, xi: 16.2, hp: '15 months', qty: 18500, p: 32.43, sec: 'Large-cap', hasAl: true },
  { id: 'e2', n: 'Axis Bluechip Fund — Direct Growth', t: 'mf', src: 'cams', cv: 500000, iv: 420000, g: 80000, gp: 19, xi: 15.8, hp: '12 months', qty: 14200, p: 35.21, sec: 'Large-cap' },
  { id: 'e3', n: 'SBI Bluechip Fund — Direct Growth', t: 'mf', src: 'cams', cv: 200000, iv: 180000, g: 20000, gp: 11.1, xi: 9.4, hp: '9 months', qty: 6800, p: 29.41, sec: 'Large-cap' },
  { id: 'e4', n: 'HDFC Bank Ltd', t: 'eq', src: 'cdsl', cv: 540000, iv: 480000, g: 60000, gp: 12.5, xi: 11.8, hp: '13 months', qty: 350, p: 1542.86, sec: 'Financials', hasAl: true },
  { id: 'e5', n: 'TCS Ltd', t: 'eq', src: 'cdsl', cv: 820000, iv: 650000, g: 170000, gp: 26.2, xi: 22.4, hp: '16 months', qty: 240, p: 3416.67, sec: 'Technology' },
  { id: 'e6', n: 'Kotak Mahindra Bank Ltd', t: 'eq', src: 'nsdl', cv: 460000, iv: 400000, g: 60000, gp: 15, xi: 12.5, hp: '10 months', qty: 280, p: 1642.86, sec: 'Financials' },
  { id: 'e7', n: 'Reliance Industries Ltd', t: 'eq', src: 'cdsl', cv: 630000, iv: 500000, g: 130000, gp: 26, xi: 21.8, hp: '12 months', qty: 300, p: 2100, sec: 'Energy', hasAl: true },
];
