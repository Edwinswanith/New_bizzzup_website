/** Tech Cogniverse mark: one curl (the C of Cogniverse) pulled out into a straight line.
 *  Drawn on the wordmark's metrics at header size: stroke = stem weight, sits on the baseline, cap-height tall. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M14.41 11.55A6.2 6.2 0 1 0 9.8 21.9H30"
        fill="none" stroke="#f2461e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
