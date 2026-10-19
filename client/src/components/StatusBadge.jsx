const StatusBadge = ({ status, className = '' }) => {
  const statusClass = status?.toLowerCase().replace(/\s+/g, '-') || 'unknown';

  return (
    <span className={`inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusClass === 'open' ? 'bg-amber-100 text-amber-800' : statusClass === 'in-progress' ? 'bg-sky-100 text-sky-800' : statusClass === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'} ${className}`.trim()}>
      <span className={`size-1.5 rounded-full bg-current ${statusClass === 'open' || statusClass === 'in-progress' ? 'animate-pulse' : ''}`} aria-hidden="true" />
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
