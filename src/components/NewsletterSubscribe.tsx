import { FormEvent, useState } from 'react';
import {
  Mail,
  SendHorizontal,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { getNewsletterSubscribeErrorMessage, subscribeToNewsletter } from '../api/newsletter';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setFeedback('');
    try {
      await subscribeToNewsletter(trimmed);
      setStatus('success');
      setFeedback("You're subscribed! We'll be in touch.");
      setEmail('');
    } catch (err) {
      setStatus('error');
      setFeedback(getNewsletterSubscribeErrorMessage(err));
    }
  };

  return (
    <section
      className="relative overflow-hidden border-t lg:h-[100vh] border-slate-200/80 bg-[color:var(--soft-bg)]"
      aria-labelledby="newsletter-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-32">
        <div className="w-full rounded-3xl md:p-10 lg:p-12">
          <div className="flex flex-col items-center gap-8 text-center md:gap-10">
            <div className="flex flex-col items-center px-5">
              <h2
                id="newsletter-heading"
                className="text-2xl font-bold tracking-tight sm:text-4xl md:text-7xl py-6"
                style={{ color: 'var(--navy)' }}
              >
                Not ready to join yet?
              </h2>
              <p
                className="mt-3 max-w-2xl text-sm leading-relaxed md:text-3xl py-3"
                style={{ color: 'var(--brand-blue)' }}
              >
                Get the free guide: The Attention Crisis Every Parent Should Understand.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full min-w-0 max-w-2xl px-5 md:px-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="relative min-w-0 flex-1">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                  style={{ color: 'var(--brand-blue)' }}
                  aria-hidden
                />
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error' || status === 'success') {
                      setStatus('idle');
                      setFeedback('');
                    }
                  }}
                  placeholder="you@example.com"
                  disabled={status === 'loading'}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-12 pr-4 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:opacity-60"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--brand-blue) 25%, rgb(226 232 240))',
                    boxShadow: '0 0 0 0 rgba(0,0,0,0)',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:px-8"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, var(--brand-blue), var(--accent-blue))',
                  boxShadow: '0 12px 22px rgba(15, 27, 53, 0.35)',
                }}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    <span>Subscribing…</span>
                  </>
                ) : (
                  <>
                    <span>Send Me the Guide</span>
                    <SendHorizontal className="h-5 w-5" aria-hidden />
                  </>
                )}
              </button>
            </div>

            {feedback && (
              <p
                className={`mt-3 flex items-center justify-center gap-2 text-sm font-medium ${
                  status === 'success' ? 'text-emerald-600' : 'text-amber-700'
                }`}
                role="status"
              >
                {status === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                ) : null}
                {feedback}
              </p>
            )}

            <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600/80" aria-hidden />
              <span>
                We respect your inbox. No spam. Unsubscribe anytime.
              </span>
            </p>
          </form>
          </div>
        </div>
      </div>
    </section>
  );
}
