import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-16 text-center">
    <span className="text-7xl font-extrabold tracking-tight text-brand-500">404</span>
    <h1 className="mt-3 text-3xl font-bold text-ink-900">Page not found</h1>
    <p className="mt-2 mb-7 text-muted-500">The page may have moved, or the address may be incorrect.</p>
    <Link to="/" className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white no-underline hover:bg-brand-600">Return to home</Link>
  </section>
);

export default NotFound;
