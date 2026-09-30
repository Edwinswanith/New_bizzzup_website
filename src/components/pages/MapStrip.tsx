import { LineStrip, type StripShape } from "./LineStrip";

/** Index pages sit above the whole system, so they show the line before it takes a region's shape. */
export function MapStrip({ shape = "tangle" }: { shape?: StripShape }) {
  return <LineStrip shape={shape} />;
}
