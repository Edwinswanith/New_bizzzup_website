import s from "./Signature.module.css";
import * as captionCc from "./CaptionCC";
import * as saloon from "./Saloon";
import * as hemantSheth from "./HemantSheth";
import * as mediConsult from "./MediConsult";
import * as designt from "./DesignT";
import * as optimaflow from "./OptimaFlow";
import * as legal from "./LegalAssistant";
import * as meridian from "./Meridian";
import * as mediscribe from "./MediScribe";
import * as neura from "./Neura";
import * as flightdeck from "./FlightDeck";
import * as kanaka from "./KanakaGoldLoan";
import * as health from "./HealthDashboard";
import * as apex from "./Apex";
import * as nutrition from "./Nutrition";
import * as voidRunner from "./VoidRunner";

type Sig = { Wide: () => React.JSX.Element; Narrow: () => React.JSX.Element };

/** Project motion signatures, by project slug. A project without one keeps its region's Line. */
const SIGNATURES: Record<string, Sig> = {
  "caption-cc": captionCc,
  saloon,
  "prof-hemant-sheth": hemantSheth,
  "doctor-ai": mediConsult,
  designt,
  optimaflow,
  "lawyer-ai": legal,
  meridian,
  mediscribe,
  neura,
  flightdeck,
  "kanaka-gold-loan": kanaka,
  "health-dashboard": health,
  apex,
  nutrition,
  "void-runner": voidRunner,
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
