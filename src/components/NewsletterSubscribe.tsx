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
      const res = await subscribeToNewsletter(trimmed);
      setStatus('success');
      setFeedback(
        (typeof res.message === 'string' && res.message.trim()
          ? res.message
          : "You're subscribed! We'll be in touch.")
      );
      setEmail('');
    } catch (err) {
      setStatus('error');
      setFeedback(getNewsletterSubscribeErrorMessage(err));
    }
  };

  return (
    <section
      className="relative overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-white via-cyan-50/40 to-slate-50"
      aria-labelledby="newsletter-heading"
    >
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-32">
        <div className="w-full rounded-3xl md:p-10 lg:p-12">
          <div className="flex flex-col items-center gap-8 text-center md:gap-10">
            <div className="flex flex-col items-center px-5">
             
              <h2
                id="newsletter-heading"
                className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
              >
                Subscribe to our newsletter
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                Get updates on new courses, events, and conscious learning—no clutter, just what
                matters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full min-w-0 max-w-2xl px-5 md:px-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="relative min-w-0 flex-1">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600/80"
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
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-12 pr-4 text-slate-900 shadow-inner outline-none ring-cyan-500/20 transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-sm shadow-cyan-600/25 transition hover:from-cyan-500 hover:to-blue-500 hover:shadow-sm hover:shadow-cyan-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-8"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    <span>Subscribing…</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
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
                We respect your inbox. Unsubscribe anytime—we never share your email with third
                parties.
              </span>
            </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
