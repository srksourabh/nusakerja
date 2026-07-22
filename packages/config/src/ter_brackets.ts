// PMK 168/2023 Official TER (Tarif Efektif Rata-rata) Tables & DTAA Treaty Rates

export interface TerBracket {
  minGrossIdr: number;
  maxGrossIdr: number;
  ratePercent: number;
}

export const TER_CATEGORY_A_BRACKETS: TerBracket[] = [
  { minGrossIdr: 0, maxGrossIdr: 5400000, ratePercent: 0.0 },
  { minGrossIdr: 5400000, maxGrossIdr: 5650000, ratePercent: 0.25 },
  { minGrossIdr: 5650000, maxGrossIdr: 5950000, ratePercent: 0.5 },
  { minGrossIdr: 5950000, maxGrossIdr: 6300000, ratePercent: 0.75 },
  { minGrossIdr: 6300000, maxGrossIdr: 6750000, ratePercent: 1.0 },
  { minGrossIdr: 6750000, maxGrossIdr: 7500000, ratePercent: 1.25 },
  { minGrossIdr: 7500000, maxGrossIdr: 8500000, ratePercent: 1.5 },
  { minGrossIdr: 8500000, maxGrossIdr: 9600000, ratePercent: 1.75 },
  { minGrossIdr: 9600000, maxGrossIdr: 10050000, ratePercent: 2.0 },
  { minGrossIdr: 10050000, maxGrossIdr: 10350000, ratePercent: 2.25 },
  { minGrossIdr: 10350000, maxGrossIdr: 10700000, ratePercent: 2.5 },
  { minGrossIdr: 10700000, maxGrossIdr: 11050000, ratePercent: 3.0 },
  { minGrossIdr: 11050000, maxGrossIdr: 11600000, ratePercent: 3.5 },
  { minGrossIdr: 11600000, maxGrossIdr: 12500000, ratePercent: 4.0 },
  { minGrossIdr: 12500000, maxGrossIdr: 13750000, ratePercent: 5.0 },
  { minGrossIdr: 13750000, maxGrossIdr: 15100000, ratePercent: 6.0 },
  { minGrossIdr: 15100000, maxGrossIdr: 16950000, ratePercent: 7.0 },
  { minGrossIdr: 16950000, maxGrossIdr: 19750000, ratePercent: 8.0 },
  { minGrossIdr: 19750000, maxGrossIdr: 24150000, ratePercent: 9.0 },
  { minGrossIdr: 24150000, maxGrossIdr: 26450000, ratePercent: 10.0 },
  { minGrossIdr: 26450000, maxGrossIdr: 28000000, ratePercent: 11.0 },
  { minGrossIdr: 28000000, maxGrossIdr: 30050000, ratePercent: 12.0 },
  { minGrossIdr: 30050000, maxGrossIdr: 32400000, ratePercent: 13.0 },
  { minGrossIdr: 32400000, maxGrossIdr: 35400000, ratePercent: 14.0 },
  { minGrossIdr: 35400000, maxGrossIdr: 39100000, ratePercent: 15.0 },
  { minGrossIdr: 39100000, maxGrossIdr: 43850000, ratePercent: 16.0 },
  { minGrossIdr: 43850000, maxGrossIdr: 47800000, ratePercent: 17.0 },
  { minGrossIdr: 47800000, maxGrossIdr: 51400000, ratePercent: 18.0 },
  { minGrossIdr: 51400000, maxGrossIdr: 56300000, ratePercent: 19.0 },
  { minGrossIdr: 56300000, maxGrossIdr: 62200000, ratePercent: 20.0 },
  { minGrossIdr: 62200000, maxGrossIdr: 68600000, ratePercent: 21.0 },
  { minGrossIdr: 68600000, maxGrossIdr: 77500000, ratePercent: 22.0 },
  { minGrossIdr: 77500000, maxGrossIdr: 89000000, ratePercent: 23.0 },
  { minGrossIdr: 89000000, maxGrossIdr: 103000000, ratePercent: 24.0 },
  { minGrossIdr: 103000000, maxGrossIdr: 125000000, ratePercent: 25.0 },
  { minGrossIdr: 125000000, maxGrossIdr: 157000000, ratePercent: 26.0 },
  { minGrossIdr: 157000000, maxGrossIdr: 206000000, ratePercent: 27.0 },
  { minGrossIdr: 206000000, maxGrossIdr: 337000000, ratePercent: 28.0 },
  { minGrossIdr: 337000000, maxGrossIdr: 454000000, ratePercent: 29.0 },
  { minGrossIdr: 454000000, maxGrossIdr: 550000000, ratePercent: 30.0 },
  { minGrossIdr: 550000000, maxGrossIdr: 695000000, ratePercent: 31.0 },
  { minGrossIdr: 695000000, maxGrossIdr: 910000000, ratePercent: 32.0 },
  { minGrossIdr: 910000000, maxGrossIdr: 1400000000, ratePercent: 33.0 },
  { minGrossIdr: 1400000000, maxGrossIdr: Infinity, ratePercent: 34.0 },
];

export const TER_CATEGORY_B_BRACKETS: TerBracket[] = [
  { minGrossIdr: 0, maxGrossIdr: 6200000, ratePercent: 0.0 },
  { minGrossIdr: 6200000, maxGrossIdr: 6500000, ratePercent: 0.25 },
  { minGrossIdr: 6500000, maxGrossIdr: 6850000, ratePercent: 0.5 },
  { minGrossIdr: 6850000, maxGrossIdr: 7300000, ratePercent: 0.75 },
  { minGrossIdr: 7300000, maxGrossIdr: 9200000, ratePercent: 1.5 },
  { minGrossIdr: 9200000, maxGrossIdr: 10750000, ratePercent: 2.0 },
  { minGrossIdr: 10750000, maxGrossIdr: 12550000, ratePercent: 3.0 },
  { minGrossIdr: 12550000, maxGrossIdr: 14300000, ratePercent: 4.0 },
  { minGrossIdr: 14300000, maxGrossIdr: 16000000, ratePercent: 5.0 },
  { minGrossIdr: 16000000, maxGrossIdr: 18000000, ratePercent: 6.0 },
  { minGrossIdr: 18000000, maxGrossIdr: 20500000, ratePercent: 8.0 },
  { minGrossIdr: 20500000, maxGrossIdr: 25000000, ratePercent: 10.0 },
  { minGrossIdr: 25000000, maxGrossIdr: 30000000, ratePercent: 12.0 },
  { minGrossIdr: 30000000, maxGrossIdr: 40000000, ratePercent: 15.0 },
  { minGrossIdr: 40000000, maxGrossIdr: 60000000, ratePercent: 20.0 },
  { minGrossIdr: 60000000, maxGrossIdr: 100000000, ratePercent: 25.0 },
  { minGrossIdr: 100000000, maxGrossIdr: Infinity, ratePercent: 30.0 },
];

export const TER_CATEGORY_C_BRACKETS: TerBracket[] = [
  { minGrossIdr: 0, maxGrossIdr: 6600000, ratePercent: 0.0 },
  { minGrossIdr: 6600000, maxGrossIdr: 6950000, ratePercent: 0.25 },
  { minGrossIdr: 6950000, maxGrossIdr: 7350000, ratePercent: 0.5 },
  { minGrossIdr: 7350000, maxGrossIdr: 7800000, ratePercent: 0.75 },
  { minGrossIdr: 7800000, maxGrossIdr: 8800000, ratePercent: 1.0 },
  { minGrossIdr: 8800000, maxGrossIdr: 9800000, ratePercent: 1.5 },
  { minGrossIdr: 9800000, maxGrossIdr: 11500000, ratePercent: 2.5 },
  { minGrossIdr: 11500000, maxGrossIdr: 13500000, ratePercent: 3.5 },
  { minGrossIdr: 13500000, maxGrossIdr: 16000000, ratePercent: 5.0 },
  { minGrossIdr: 16000000, maxGrossIdr: 19000000, ratePercent: 7.0 },
  { minGrossIdr: 19000000, maxGrossIdr: 23000000, ratePercent: 9.0 },
  { minGrossIdr: 23000000, maxGrossIdr: 30000000, ratePercent: 12.0 },
  { minGrossIdr: 30000000, maxGrossIdr: 45000000, ratePercent: 16.0 },
  { minGrossIdr: 45000000, maxGrossIdr: 75000000, ratePercent: 22.0 },
  { minGrossIdr: 75000000, maxGrossIdr: Infinity, ratePercent: 31.0 },
];

// DTAA Double Tax Avoidance Treaty Rates (PPh 26 reduced rates with DGT Form)
export const DTAA_TREATY_RATES: Record<string, number> = {
  SG: 0.10, // Singapore 10%
  JP: 0.10, // Japan 10%
  US: 0.15, // USA 15%
  MY: 0.10, // Malaysia 10%
  AU: 0.15, // Australia 15%
  GB: 0.10, // UK 10%
  DE: 0.10, // Germany 10%
  DEFAULT: 0.20, // Standard PPh 26 (20%)
};
