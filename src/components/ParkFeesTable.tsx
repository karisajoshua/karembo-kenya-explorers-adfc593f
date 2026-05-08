import { Info } from "lucide-react";
import { matchParks, RESIDENCY_LABELS, formatRate, type Residency } from "@/data/parkFees";

type Props = {
  /** Strings searched for park keywords — typically [title, ...highlights, summary] */
  context: string[];
};

const COLS: Residency[] = ["ea_citizen", "resident", "non_resident", "african_citizen"];

export const ParkFeesTable = ({ context }: Props) => {
  const parks = matchParks(context);
  if (parks.length === 0) return null;

  return (
    <div>
      <h2 className="font-serif text-3xl text-primary mb-2">Park entry fees</h2>
      <p className="text-sm text-muted-foreground mb-5 flex items-start gap-2">
        <Info className="h-4 w-4 text-accent mt-0.5 shrink-0" />
        Reference rates per person, per day in USD. Non-resident fees are typically included in this package; resident, EA citizen and African citizen rates require valid ID at the gate.
      </p>

      <div className="space-y-6">
        {parks.map((p) => (
          <div key={p.name} className="bg-sand rounded-lg overflow-hidden border border-border">
            <div className="px-5 py-3 bg-primary text-primary-foreground font-serif text-lg">
              {p.name}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="px-5 py-3 font-semibold">Category</th>
                    {COLS.map((c) => (
                      <th key={c} className="px-5 py-3 font-semibold">{RESIDENCY_LABELS[c]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/60">
                    <td className="px-5 py-3 font-medium text-primary">Adult</td>
                    {COLS.map((c) => (
                      <td key={c} className="px-5 py-3 text-foreground/80">{formatRate(p.rates[c].adult)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-primary">Child</td>
                    {COLS.map((c) => (
                      <td key={c} className="px-5 py-3 text-foreground/80">{formatRate(p.rates[c].child)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {p.note && (
              <div className="px-5 py-2 text-xs text-muted-foreground bg-card">{p.note}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
