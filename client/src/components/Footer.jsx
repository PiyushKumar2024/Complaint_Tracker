import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-auto border-t border-line-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 text-sm text-muted-500 sm:flex-row sm:items-center sm:px-8">
      <Link className="font-bold text-ink-900 no-underline" to="/">Complaint Tracker</Link>
      <p className="m-0">Making community concerns visible, trackable, and accountable.</p>
      <span>© {new Date().getFullYear()} Complaint Tracker</span>
    </div>
  </footer>
);

export default Footer;
