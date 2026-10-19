import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '📝',
    title: 'File in minutes',
    description: 'Send your concern to the right department with a clear description, location, and supporting files.',
  },
  {
    icon: '🔎',
    title: 'Follow every update',
    description: 'See the current status and a timestamped history of actions taken on your complaint.',
  },
  {
    icon: '🤝',
    title: 'Accountable resolution',
    description: 'Complaints are routed to the responsible team and tracked through a clear resolution workflow.',
  },
];

const STEPS = [
  ['01', 'Create an account', 'Register securely to keep your complaint history together.'],
  ['02', 'Tell us what happened', 'Choose a department and category, add the location, and attach evidence.'],
  ['03', 'Track progress', 'Return to your dashboard to follow status changes through resolution.'],
];

const LandingPage = () => (
  <div>
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
      <div>
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-brand-600">A clearer path to resolution</span>
        <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">Your concerns deserve to be <span className="text-brand-600">heard and resolved.</span></h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-500">
          Submit community complaints to the right department and follow progress
          with transparent status updates from filing to resolution.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/register" className="rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white no-underline shadow-sm transition hover:bg-brand-600">File a complaint</Link>
          <Link to="/login" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-ink-700 no-underline transition hover:border-brand-500 hover:text-brand-700">Sign in</Link>
        </div>
        <div className="mt-7 flex items-center gap-2 text-sm text-muted-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Every submission includes a trackable status and timeline.
        </div>
      </div>
      <div className="relative mx-auto flex min-h-[340px] w-full max-w-lg items-center justify-center rounded-3xl bg-gradient-to-br from-brand-50 via-sky-50 to-indigo-100 p-6 sm:min-h-[400px]" aria-label="Complaint progress example">
        <article className="relative z-10 w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">✓</span>
            <span className="flex-1 text-xs font-bold tracking-wider text-muted-500">COMPLAINT TRACKER</span>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">In Progress</span>
          </div>
          <h2 className="mt-7 text-xl font-bold text-ink-900">Streetlight repair request</h2>
          <p className="mt-1 text-sm text-muted-500">Public Works · Street Lights</p>
          <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-2/3 rounded-full bg-brand-500" /></div>
          <div className="mt-3 flex justify-between text-xs font-medium text-muted-500">
            <span className="text-emerald-700">Submitted</span>
            <span className="text-brand-700">In Progress</span>
            <span>Resolved</span>
          </div>
          <div className="mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm text-muted-500">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Field team assigned · Today, 10:42 AM
          </div>
        </article>
      </div>
    </section>

    <section className="grid grid-cols-1 gap-6 border-y border-slate-200 bg-white px-5 py-8 text-center sm:grid-cols-3 sm:px-8" aria-label="Platform highlights">
      <div><strong className="block text-2xl font-bold text-ink-900">6</strong><span className="text-sm text-muted-500">Service departments</span></div>
      <div><strong className="block text-2xl font-bold text-ink-900">4 steps</strong><span className="text-sm text-muted-500">Clear resolution workflow</span></div>
      <div><strong className="block text-2xl font-bold text-ink-900">Anytime</strong><span className="text-sm text-muted-500">Check your complaint status</span></div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Built for transparency</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">A better way to get things moving</h2>
        <p className="mt-3 leading-relaxed text-muted-500">One place to file an issue, understand where it belongs, and see what happens next.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card" key={feature.title}>
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl" aria-hidden="true">{feature.icon}</span>
            <h3 className="text-lg font-bold text-ink-900">{feature.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-500">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-slate-100 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto mb-10 max-w-6xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Simple by design</span>
        <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">From concern to action</h2>
      </div>
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
        {STEPS.map(([number, title, description]) => (
          <article className="rounded-xl bg-white p-6 shadow-sm" key={number}>
            <span className="text-sm font-bold tracking-widest text-brand-600">{number}</span>
            <h3 className="mt-3 text-lg font-bold text-ink-900">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted-500">{description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="mx-5 mb-16 flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink-900 px-6 py-10 text-white sm:mx-8 sm:px-10 lg:mx-auto lg:max-w-6xl lg:flex-row lg:items-center">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Make your voice count</span>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Start tracking what matters to you.</h2>
        <p className="mt-2 text-slate-300">Register to file a complaint and stay informed as it moves forward.</p>
      </div>
      <Link to="/register" className="shrink-0 rounded-lg bg-white px-6 py-3 font-semibold text-ink-900 no-underline hover:bg-slate-100">Get started <span aria-hidden="true">→</span></Link>
    </section>
  </div>
);

export default LandingPage;
