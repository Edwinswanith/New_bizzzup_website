import Link from "next/link";
import type { RegionId } from "@/content/types";
import { REGIONS, regionById } from "@/content/regions";
import { LineStrip } from "./LineStrip";
import styles from "./RegionBanner.module.css";

const QUAD: Record<RegionId, [number, number]> = { voice: [0, 0], knowledge: [1, 0], operations: [0, 1], products: [1, 1] };

/** Entering one region of the system: the Line in the shape it takes for that region on the homepage. */
/** `figure` (a project motion signature) takes the strip's middle in place of the region's Line. */
export function RegionBanner({ region, trail, figure }: { region: RegionId; trail: { href: string; label: string }[]; figure?: React.ReactNode }) {
  const r = regionById(region)!;
  return (
    <LineStrip shape={figure ? null : region} tall={!!figure}>
      <nav aria-label="Breadcrumb" className={styles.trail}>
        <ol>
          <li><Link href="/#system">System</Link></li>
          {trail.map((t) => <li key={t.href}><Link href={t.href}>{t.label}</Link></li>)}
        </ol>
      </nav>
      {figure}
      <div className={styles.tag}>
        <svg viewBox="0 0 44 26" className={styles.mini} aria-hidden="true">
          {REGIONS.map((rg) => {
            const [x, y] = QUAD[rg.id];
            return <rect key={rg.id} x={x * 23} y={y * 13} width="21" height="11" className={rg.id === region ? styles.on : styles.off} />;
          })}
        </svg>
        <span className="mono">{r.name} region</span>
        <span className={`mono ${styles.grammar}`}>{r.grammar.join(" → ")}</span>
      </div>
    </LineStrip>
  );
}
