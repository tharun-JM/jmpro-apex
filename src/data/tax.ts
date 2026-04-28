export interface TaxEntry {
  id: string;
  name: string;
  gain: number;
  hp: string;
  hpDays: number;
  classification: 'STCG' | 'LTCG';
  taxRate: number;
  daysToLTCG: number | null;
  taxToday: number;
  taxAfterLTCG: number | null;
  saving: number | null;
}

export const TAX_DATA: TaxEntry[] = [
  { id: 'j1', name: 'JM Flexi Cap Fund — Direct Growth', gain: 5480000, hp: '10m 8d', hpDays: 308, classification: 'STCG', taxRate: 0.20, daysToLTCG: 18, taxToday: 384000, taxAfterLTCG: 270000, saving: 114000 },
  { id: 'j2', name: 'Reliance Industries Ltd', gain: 4820000, hp: '8 months', hpDays: 243, classification: 'STCG', taxRate: 0.20, daysToLTCG: 122, taxToday: 964000, taxAfterLTCG: 478000, saving: 486000 },
  { id: 'j3', name: 'HDFC Bank Ltd (JMPro)', gain: 145400, hp: '7 months', hpDays: 213, classification: 'STCG', taxRate: 0.20, daysToLTCG: 152, taxToday: 29080, taxAfterLTCG: 2550, saving: 26530 },
  { id: 'j5', name: 'Infosys Ltd', gain: 160000, hp: '11 months', hpDays: 335, classification: 'STCG', taxRate: 0.20, daysToLTCG: 30, taxToday: 32000, taxAfterLTCG: 4375, saving: 27625 },
  { id: 'e4', name: 'HDFC Bank Ltd (CDSL)', gain: 60000, hp: '13 months', hpDays: 396, classification: 'LTCG', taxRate: 0.125, daysToLTCG: null, taxToday: 0, taxAfterLTCG: null, saving: null },
  { id: 'j4', name: 'JM Small Cap Fund — Direct Growth', gain: 300000, hp: '14 months', hpDays: 427, classification: 'LTCG', taxRate: 0.125, daysToLTCG: null, taxToday: 21875, taxAfterLTCG: null, saving: null },
];
