const LoadingState = ({ label = 'Loading...', count = 3 }) => (
  <div className="mx-auto max-w-6xl p-4 sm:p-8" role="status" aria-label={label}>
    <span className="mb-4 block font-semibold text-muted-500">{label}</span>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm" key={index}>
          <div className="mb-3 h-4 w-2/3 animate-[skeleton-shimmer_1.4s_ease_infinite] rounded bg-[linear-gradient(90deg,#edf1f4_25%,#f7f9fa_38%,#edf1f4_63%)] bg-[length:400%_100%]" />
          <div className="mb-3 h-3 w-2/5 animate-[skeleton-shimmer_1.4s_ease_infinite] rounded bg-[linear-gradient(90deg,#edf1f4_25%,#f7f9fa_38%,#edf1f4_63%)] bg-[length:400%_100%]" />
          <div className="mb-3 h-18 animate-[skeleton-shimmer_1.4s_ease_infinite] rounded bg-[linear-gradient(90deg,#edf1f4_25%,#f7f9fa_38%,#edf1f4_63%)] bg-[length:400%_100%]" />
          <div className="h-3 animate-[skeleton-shimmer_1.4s_ease_infinite] rounded bg-[linear-gradient(90deg,#edf1f4_25%,#f7f9fa_38%,#edf1f4_63%)] bg-[length:400%_100%]" />
        </div>
      ))}
    </div>
  </div>
);

export default LoadingState;
