import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint }) => {
  const getPriorityBadge = (priority) => {
    const isHigh = priority === 'High' || priority === 'Urgent';
    return (
      <span className={`rounded px-2 py-1 text-xs font-bold uppercase ${isHigh ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
        {priority}
      </span>
    );
  };

  return (
    <article className={`flex h-full flex-col rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${complaint.status === 'Open' ? 'border-l-amber-500' : complaint.status === 'In Progress' ? 'border-l-sky-500' : complaint.status === 'Resolved' ? 'border-l-green-500' : 'border-l-slate-400'}`}>
      <div className="mb-4 flex items-start justify-between gap-3 max-[480px]:flex-col">
        <h3 className="m-0 break-words text-lg font-semibold text-ink-900">{complaint.title}</h3>
        <StatusBadge status={complaint.status} />
      </div>
      
      <div className="flex-grow">
        <p className="mb-6 text-sm leading-relaxed text-muted-500">
          {complaint.description.length > 100 
            ? `${complaint.description.substring(0, 100)}...` 
            : complaint.description}
        </p>
        
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="flex flex-col text-sm">
            <span className="text-xs font-medium text-slate-400">Department</span>
            <span className="font-semibold text-ink-700">{complaint.department?.name || 'N/A'}</span>
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-xs font-medium text-slate-400">Category</span>
            <span className="font-semibold text-ink-700">{complaint.category}</span>
          </div>
          {complaint.location?.city && (
            <div className="flex flex-col text-sm">
              <span className="text-xs font-medium text-slate-400">Location</span>
              <span className="font-semibold text-ink-700">{complaint.location.city}</span>
            </div>
          )}
          <div className="flex flex-col text-sm">
            <span className="text-xs font-medium text-slate-400">Filed On</span>
            <span className="font-semibold text-ink-700">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        {getPriorityBadge(complaint.priority)}
        <Link to={`/complaint/${complaint._id}`} className="font-semibold text-brand-600 no-underline hover:text-brand-700 hover:underline">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default ComplaintCard;
