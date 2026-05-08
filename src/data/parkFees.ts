export type Residency = "ea_citizen" | "resident" | "non_resident" | "african_citizen";

export const RESIDENCY_LABELS: Record<Residency, string> = {
  ea_citizen: "EA Citizen",
  resident: "Resident",
  non_resident: "Non-Resident",
  african_citizen: "African Citizen",
};

export type ParkRate = { adult: number; child: number };

export type ParkFee = {
  name: string;
  /** Lowercase keywords used to auto-match a package's title/highlights */
  keywords: string[];
  rates: Record<Residency, ParkRate>;
  note?: string;
};

const r = (
  ea: [number, number],
  res: [number, number],
  nr: [number, number],
  af: [number, number],
): Record<Residency, ParkRate> => ({
  ea_citizen: { adult: ea[0], child: ea[1] },
  resident: { adult: res[0], child: res[1] },
  non_resident: { adult: nr[0], child: nr[1] },
  african_citizen: { adult: af[0], child: af[1] },
});

export const PARK_FEES: ParkFee[] = [
  { name: "Amboseli National Park", keywords: ["amboseli"], rates: r([12.49,6.24],[16.86,8.74],[96.75,48.38],[53.75,26.88]) },
  { name: "Lake Nakuru National Park", keywords: ["nakuru"], rates: r([12.49,6.24],[16.86,8.74],[96.75,48.38],[53.75,26.88]) },
  { name: "Nairobi National Park", keywords: ["nairobi national park","nairobi np"], rates: r([8.32,4.16],[11.24,5.62],[86.00,43.00],[43.00,21.50]) },
  { name: "Tsavo East National Park", keywords: ["tsavo east","tsavo"], rates: r([8.32,4.16],[11.24,5.62],[86.00,43.00],[43.00,21.50]) },
  { name: "Tsavo West National Park", keywords: ["tsavo west"], rates: r([8.32,4.16],[11.24,5.62],[86.00,43.00],[43.00,21.50]) },
  { name: "Meru National Park", keywords: ["meru"], rates: r([6.66,4.16],[9.16,5.62],[75.25,43.00],[43.00,21.50]) },
  { name: "Kora National Park", keywords: ["kora"], rates: r([6.66,4.16],[9.16,5.62],[75.25,43.00],[43.00,21.50]) },
  { name: "Aberdare National Park", keywords: ["aberdare"], rates: r([6.66,4.16],[9.16,5.62],[75.25,43.00],[43.00,21.50]) },
  { name: "Mt. Kenya National Park", keywords: ["mt kenya","mount kenya","mt. kenya"], rates: r([6.66,3.33],[9.16,4.58],[75.25,37.62],[32.25,16.12]) },
  { name: "Hell's Gate National Park", keywords: ["hell's gate","hells gate"], rates: r([4.16,2.08],[5.62,2.91],[53.75,26.88],[21.50,10.75]) },
  { name: "Mt. Longonot National Park", keywords: ["longonot"], rates: r([4.16,2.08],[5.62,2.91],[53.75,26.88],[21.50,10.75]) },
  { name: "Mt. Elgon National Park", keywords: ["elgon"], rates: r([4.16,2.08],[5.62,2.91],[53.75,26.88],[21.50,10.75]) },
  { name: "Ol Donyo Sabuk National Park", keywords: ["ol donyo","sabuk"], rates: r([4.16,2.08],[5.62,2.91],[53.75,26.88],[21.50,10.75]) },
  { name: "Lake Elementaita Wildlife Sanctuary", keywords: ["elementaita","elmenteita"], rates: r([4.16,2.08],[5.62,2.91],[53.75,26.88],[21.50,10.75]) },
  { name: "Shimba Hills National Reserve", keywords: ["shimba"], rates: r([4.16,2.08],[5.62,2.91],[53.75,26.88],[21.50,10.75]) },
  { name: "Kakamega National Reserve", keywords: ["kakamega"], rates: r([4.16,2.08],[5.62,2.91],[53.75,26.88],[21.50,10.75]) },
  { name: "Mwea National Reserve", keywords: ["mwea"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Ruma National Park", keywords: ["ruma"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Saiwa Swamp National Park", keywords: ["saiwa"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "South Turkana National Reserve", keywords: ["south turkana"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Sibiloi National Park", keywords: ["sibiloi"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Central Island National Park", keywords: ["central island"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "South Island National Park", keywords: ["south island"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Ndere Island National Park", keywords: ["ndere"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Malka Mari National Park", keywords: ["malka mari"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Chyulu Hills National Park", keywords: ["chyulu"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Marsabit National Park", keywords: ["marsabit"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Tana River Primate National Reserve", keywords: ["tana river"], rates: r([4.16,2.08],[5.62,2.91],[43.00,21.50],[21.50,10.75]) },
  { name: "Nairobi Animal Orphanage", keywords: ["animal orphanage","elephant orphanage","orphanage"], rates: r([2.50,1.66],[3.37,2.50],[26.88,16.12],[16.12,10.75]) },
  { name: "Nairobi Safari Walk", keywords: ["safari walk"], rates: r([2.50,1.66],[3.37,2.50],[26.88,16.12],[16.12,10.75]) },
  { name: "Kisumu Impala Sanctuary", keywords: ["impala"], rates: r([2.50,1.66],[3.37,2.50],[26.88,16.12],[16.12,10.75]) },
  { name: "Kisite Mpunguti Marine Park / Reserve", keywords: ["kisite","mpunguti"], rates: r([4.16,2.08],[5.62,2.91],[26.88,16.12],[16.12,10.75]) },
  { name: "Watamu Marine Park / Reserve", keywords: ["watamu"], rates: r([4.16,2.08],[5.62,2.91],[26.88,16.12],[16.12,10.75]) },
  { name: "Mombasa Marine Park / Reserve", keywords: ["mombasa marine"], rates: r([4.16,2.08],[5.62,2.91],[26.88,16.12],[16.12,10.75]) },
  { name: "Malindi Marine Park / Reserve", keywords: ["malindi"], rates: r([4.16,2.08],[5.62,2.91],[26.88,16.12],[16.12,10.75]) },
  { name: "Kiunga Marine Reserve", keywords: ["kiunga"], rates: r([4.16,2.08],[5.62,2.91],[26.88,16.12],[16.12,10.75]) },
  { name: "Diani Chale Marine Reserve", keywords: ["diani","chale"], rates: r([4.16,2.08],[5.62,2.91],[26.88,16.12],[16.12,10.75]) },
];

/** Match parks mentioned anywhere in the supplied haystack strings. */
export const matchParks = (haystack: string[]): ParkFee[] => {
  const text = haystack.filter(Boolean).join(" ").toLowerCase();
  return PARK_FEES.filter((p) => p.keywords.some((k) => text.includes(k)));
};

export const findParkByName = (name: string): ParkFee | undefined =>
  PARK_FEES.find((p) => p.name === name);

const fmt = (n: number) => `$${n.toFixed(2)}`;
export const formatRate = (n: number) => fmt(n);
