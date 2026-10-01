import s from "./Signature.module.css";
import { d, wave } from "./util";
import { L, Chip, W, Dot, Lines, Card, Frame } from "./parts";

/* MediConsult: a voice consultation, transcribed live → routed to an available doctor → booked and synced to
   the calendar → a prescription that passes doctor review before it is sent.
   Facts: VAPI voice calling routes patients to available doctors; Deepgram live transcription; Outlook sync via
   Graph API; prescriptions: request → doctor review → approval → PDF → SMS/email. */

export const label =
  "Illustration of MediConsult: a patient's voice call is transcribed live, routed to an available doctor, booked into a calendar synced with Outlook, and any prescription goes through doctor review and approval before it is generated as a PDF and sent by SMS or email.";

const RX: [string, number, number][] = [["Request", 700, 80], ["Doctor review", 792, 118], ["Approved", 922, 90], ["PDF", 1024, 60], ["SMS · email", 1096, 100]];

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Call · live transcript" at={0} />
      <path d={wave(0, 220, 52, 22, 5)} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.05)} />
      <Lines x={0} y={92} ws={[200, 150, 176]} gap={12} at={0.55} />

      <L x={260} t="02 · Doctor" at={0.7} />
      <W p="M220 52 C240 52 240 76 262 76" at={0.75} />
      {[0, 1, 2].map((i) => <Chip key={i} x={262} y={28 + i * 34} w={150} t={i === 1 ? "Available" : "Busy"} on={i === 1} at={0.8 + i * 0.07} />)}

      <L x={460} t="03 · Booked · Outlook" at={1.15} />
      <W p="M412 76 H460" at={1.15} />
      <Card x={460} y={28} w={200} h={106} at={1.2} />
      {Array.from({ length: 15 }, (_, k) => {
        const c = k % 5, r = Math.floor(k / 5), on = k === 7;
        return <rect key={k} x={472 + c * 37} y={40 + r * 30} width="31" height="22" rx="2" className={`${on ? s.hot : s.box} ${s.pop}`} style={d(1.25 + k * 0.015 + (on ? 0.3 : 0))} />;
      })}

      <L x={700} t="04 · Prescription" at={1.6} />
      <W p="M660 81 H700" at={1.6} />
      {RX.map(([t, x, w], i) => (
        <g key={t}>
          {i > 0 && <W p={`M${RX[i - 1][1] + RX[i - 1][2]} 81 H${x}`} at={1.7 + i * 0.12} />}
          <Chip x={x} y={69} w={w} t={t} dash={i === 1} on={i === 4} at={1.7 + i * 0.12} size={10} />
        </g>
      ))}
      <text x="792" y="118" className={s.fade} style={d(2.4)}>A doctor reviews before approval</text>
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Call" at={0} />
      <path d={wave(0, 70, 40, 14, 3)} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.05)} />
      <Lines x={0} y={66} ws={[64, 46, 56]} gap={9} h={3} at={0.4} />
      <W p="M70 40 C80 40 80 52 90 52" at={0.55} />
      <L x={90} t="Doctor" at={0.55} />
      {[0, 1, 2].map((i) => <rect key={i} x={90} y={22 + i * 22} width="52" height="16" rx="2" className={`${i === 1 ? s.boxOn : s.box} ${s.rise}`} style={d(0.6 + i * 0.06)} />)}
      <W p="M142 52 H156" at={0.85} />
      <L x={156} t="Booked" at={0.85} />
      {Array.from({ length: 9 }, (_, k) => (
        <rect key={k} x={156 + (k % 3) * 22} y={22 + Math.floor(k / 3) * 22} width="18" height="16" rx="1.5" className={`${k === 4 ? s.hot : s.box} ${s.pop}`} style={d(0.9 + k * 0.02 + (k === 4 ? 0.2 : 0))} />
      ))}
      <W p="M222 52 H236" at={1.2} />
      <L x={236} t="Rx" at={1.2} />
      <Chip x={236} y={20} w={124} h={20} t="Doctor review" dash at={1.3} size={10} />
      <Chip x={236} y={44} w={124} h={20} t="Approved · PDF" at={1.4} size={10} />
      <Chip x={236} y={68} w={124} h={20} t="SMS · email" on at={1.5} size={10} />
    </Frame>
  );
}
