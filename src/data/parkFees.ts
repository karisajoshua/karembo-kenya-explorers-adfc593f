export type FeeRow = {
  category: "Non-Resident" | "Citizen" | "Resident";
  adult: string;
  child: string;
};

export type ParkFee = {
  name: string;
  /** Lowercase keywords used to auto-match a package's title/highlights */
  keywords: string[];
  rows: FeeRow[];
  note?: string;
};

export const PARK_FEES: ParkFee[] = [
  {
    name: "Nairobi National Park",
    keywords: ["nairobi national park", "nairobi np", "nairobi park"],
    rows: [
      { category: "Non-Resident", adult: "$80", child: "$40" },
      { category: "Citizen", adult: "KES 1,000", child: "KES 520" },
      { category: "Resident", adult: "KES 1,400", child: "KES 695" },
    ],
  },
  {
    name: "Mt. Longonot National Park",
    keywords: ["longonot"],
    rows: [
      { category: "Non-Resident", adult: "$51", child: "$26" },
      { category: "Citizen", adult: "KES 520", child: "KES 260" },
      { category: "Resident", adult: "KES 695", child: "KES 265" },
    ],
  },
  {
    name: "Hell's Gate National Park",
    keywords: ["hell's gate", "hells gate"],
    rows: [
      { category: "Non-Resident", adult: "$37", child: "—" },
      { category: "Citizen", adult: "KES 300", child: "KES 215" },
      { category: "Resident", adult: "KES 2,200", child: "KES 1,850" },
    ],
  },
  {
    name: "Amboseli National Park",
    keywords: ["amboseli"],
    rows: [
      { category: "Non-Resident", adult: "$91", child: "$46" },
      { category: "Citizen", adult: "KES 1,550", child: "KES 775" },
      { category: "Resident", adult: "KES 775", child: "—" },
    ],
  },
  {
    name: "Tsavo East National Park",
    keywords: ["tsavo"],
    rows: [
      { category: "Non-Resident", adult: "$81", child: "—" },
      { category: "Citizen", adult: "KES 1,050", child: "KES 520" },
      { category: "Resident", adult: "KES 1,400", child: "KES 695" },
    ],
  },
];

/**
 * Match parks mentioned anywhere in the supplied haystack strings.
 */
export const matchParks = (haystack: string[]): ParkFee[] => {
  const text = haystack.filter(Boolean).join(" ").toLowerCase();
  return PARK_FEES.filter((p) => p.keywords.some((k) => text.includes(k)));
};
