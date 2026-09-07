/**
 * Placeholder ranking until the Dansk Skak Union feed is wired.
 * Names and numbers are invented — not the live club list.
 */
export interface SampleRating {
  id: string;
  name: string;
  rating: number;
  rapid: number;
  blitz: number;
  fide: number | null;
}

export const sampleRatings: readonly SampleRating[] = [
  { id: "1", name: "Mira Solvang", rating: 2241, rapid: 2190, blitz: 2165, fide: 2238 },
  { id: "2", name: "Jonas Holm", rating: 2186, rapid: 2144, blitz: 2112, fide: 2179 },
  { id: "3", name: "Elena Varga", rating: 2110, rapid: 2088, blitz: 2040, fide: 2104 },
  { id: "4", name: "Noah Berg", rating: 2048, rapid: 1995, blitz: 2011, fide: 2062 },
  { id: "5", name: "Sofia Lind", rating: 1987, rapid: 1940, blitz: 1918, fide: 1991 },
  { id: "6", name: "Karim Haddad", rating: 1922, rapid: 1881, blitz: 1860, fide: 1935 },
  { id: "7", name: "Ida Kruse", rating: 1864, rapid: 1810, blitz: 1794, fide: 1850 },
  { id: "8", name: "Lukas Møller", rating: 1798, rapid: 1766, blitz: 1742, fide: 1812 },
  { id: "9", name: "Priya Mehta", rating: 1725, rapid: 1690, blitz: 1668, fide: null },
  { id: "10", name: "Anders Frost", rating: 1661, rapid: 1633, blitz: 1604, fide: 1688 },
  { id: "11", name: "Clara Jensen", rating: 1594, rapid: 1570, blitz: 1548, fide: null },
  { id: "12", name: "Mateo Ruiz", rating: 1510, rapid: 1488, blitz: 1500, fide: 1522 },
  { id: "13", name: "Freja Holm", rating: 1442, rapid: 1400, blitz: 1416, fide: null },
  { id: "14", name: "Omar Saleh", rating: 1368, rapid: 1340, blitz: 1300, fide: null },
  { id: "15", name: "Thea Nørgaard", rating: 1284, rapid: 1260, blitz: 1244, fide: null },
  { id: "16", name: "Leo Hartmann", rating: 1200, rapid: 1200, blitz: 1200, fide: null },
];
