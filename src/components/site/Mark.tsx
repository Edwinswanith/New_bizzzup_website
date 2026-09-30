/** Tech Cogniverse mark: a tangle pulled into one straight line. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M3 21c2-9 9-11 9-5s-6 5-4-1 8-8 9-2-3 6-2 3c1-3 4-1 5-0.5H29"
        fill="none" stroke="#f2461e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
