import { Info } from "lucide-react";
import { matchParks } from "@/data/parkFees";

type Props = {
  /** Strings searched for park keywords — typically [title, ...highlights, summary] */
  context: string[];
};

export const ParkFeesTable = ({ context }: Props) => {
  const parks = matchParks(context);
  if (parks.length === 0) return null;

  return (
    <div>
      <h2 className="font-serif text-3xl text-primary mb-2">Park entry fees</h2>
      <p className="text-sm text-muted-foreground mb-5 flex items-start gap-2">
        <Info className="h-4 w-4 text-accent mt-0.5 shrink-0" />
        Reference rates per person, per day. Non-resident fees are already included in this package; resident & citizen rates require valid ID at the gate.
      </p>

      <div className="space-y-6">
        {parks.map((p) => (
          <div key={p.name} className="bg-sand rounded-lg overflow-hidden border border-border">
            <div className="px-5 py-3 bg-primary text-primary-foreground font-serif text-lg">
              {p.name}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Adult</th>
                    <th className="px-5 py-3 font-semibold">Child</th>
                  </tr>
                </thead>
                <tbody>
                  {p.rows.map((r) => (
                    <tr key={r.category} className="border-b border-border/60 last:border-0">
                      <td className="px-5 py-3 font-medium text-primary">{r.category}</td>
                      <td className="px-5 py-3 text-foreground/80">{r.adult}</td>
                      <td className="px-5 py-3 text-foreground/80">{r.child}</td>
                    </tr>
                  ))}
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
