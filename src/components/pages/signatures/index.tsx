import s from "./Signature.module.css";
import * as captionCc from "./CaptionCC";
import * as saloon from "./Saloon";
import * as hemantSheth from "./HemantSheth";

type Sig = { Wide: () => React.JSX.Element; Narrow: () => React.JSX.Element };

/** Project motion signatures, by project slug. A project without one keeps its region's Line. */
const SIGNATURES: Record<string, Sig> = {
  "caption-cc": captionCc,
  saloon,
  "prof-hemant-sheth": hemantSheth,
};

export const hasSignature = (slug: string) => slug in SIGNATURES;

export function ProjectSignature({ slug }: { slug: string }) {
  const sig = SIGNATURES[slug];
  if (!sig) return null;
  return (
    <div className={s.fig} data-signature={slug}>
      <div className={s.wide}><sig.Wide /></div>
      <div className={s.narrow}><sig.Narrow /></div>
    </div>
  );
}
