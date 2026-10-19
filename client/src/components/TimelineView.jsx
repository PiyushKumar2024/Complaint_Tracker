const TimelineView = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return <p className="text-sm text-muted-500">No timeline entries yet.</p>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return '🔴';
      case 'In Progress': return '🔵';
      case 'Resolved': return '🟢';
      case 'Closed': return '⚪';
      default: return '⚫';
    }
  };

  return (
    <div className="space-y-0">
      {timeline.map((entry, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex w-7 shrink-0 flex-col items-center">
            <span className={`grid size-7 place-items-center rounded-full text-sm ${index === timeline.length - 1 ? 'bg-brand-100 ring-4 ring-brand-50' : 'bg-slate-100'}`}>
              {getStatusIcon(entry.status)}
            </span>
            {index < timeline.length - 1 && <div className="my-1 min-h-10 w-px flex-1 bg-slate-200" />}
          </div>
          <div className="mb-5 min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-ink-900">{entry.status}</span>
              <span className="text-xs text-muted-500">
                {new Date(entry.timestamp).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {entry.comment && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{entry.comment}</p>
            )}
            {entry.updatedBy && (
              <span className="mt-2 block text-xs text-muted-500">
                by {entry.updatedBy.name || 'System'} ({entry.updatedBy.role || ''})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
