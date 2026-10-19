import './TimelineView.css';

const TimelineView = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return <p className="timeline-empty">No timeline entries yet.</p>;
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
    <div className="timeline">
      {timeline.map((entry, index) => (
        <div key={index} className={`timeline-item ${index === timeline.length - 1 ? 'timeline-latest' : ''}`}>
          <div className="timeline-line">
            <span className="timeline-dot">{getStatusIcon(entry.status)}</span>
            {index < timeline.length - 1 && <div className="timeline-connector"></div>}
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="timeline-status">{entry.status}</span>
              <span className="timeline-date">
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
              <p className="timeline-comment">{entry.comment}</p>
            )}
            {entry.updatedBy && (
              <span className="timeline-user">
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
