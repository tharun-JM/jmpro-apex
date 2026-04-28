export interface SectorBar {
  name: string;
  pct: number;
  level: 'red' | 'amber' | 'green';
}

export const SECTORS: SectorBar[] = [
  { name: 'Financials', pct: 41, level: 'red' },
  { name: 'Energy', pct: 21, level: 'amber' },
  { name: 'Technology', pct: 18, level: 'amber' },
  { name: 'Healthcare', pct: 8, level: 'green' },
  { name: 'FMCG', pct: 5, level: 'green' },
  { name: 'Multi-cap', pct: 4, level: 'green' },
  { name: 'Other', pct: 3, level: 'green' },
];
