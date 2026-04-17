import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import PrimaryButton from './PrimaryButton';

const PRICING = {
  heading: 'Join the Founding Families',
  subheading:
    'A small group of families who believe education can be different. This is your invitation.',
  includes: [
    'Full access to Attention Heist.',
    'Early access to the full universe as it grows.',
    'Founding member pricing locked in permanently.',
  ],
  cta: 'Begin Early Access',
  reassurance: 'No fake deadlines. No hidden fees. Cancel anytime.',
  price: '$29',
  period: '/month',
  priceNote: 'Founding family subscription',
} as const;

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-blue-100 relative overflow-hidden lg:min-h-screen lg:flex lg:items-center py-16 sm:py-20 md:py-24">
      {/* large oval background solids */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 -top-20 h-[1220px] w-[860px] rounded-[9px] bg-white rotate-12" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start lg:items-center">
          <div className="text-left lg:col-span-3 motion-safe:animate-fade-in">
            <h2
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight py-6"
              style={{ color: 'var(--brand-blue)' }}
            >
              {PRICING.heading}
            </h2>
            <p
              className="mt-5 text-lg sm:text-xl md:text-4xl leading-relaxed max-w-2xl text-slate-700"
            >
              {PRICING.subheading}
            </p>
          </div>

          <div className="w-full lg:col-span-2 motion-safe:animate-fade-in motion-safe:[animation-delay:120ms]">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-lg p-7 sm:p-9 md:p-10">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="text-md font-semibold tracking-wide text-slate-500 py-6">
                    {PRICING.priceNote}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div
                      className="text-5xl sm:text-7xl font-bold tracking-tight"
                      style={{ color: 'var(--navy)' }}
                    >
                      {PRICING.price}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-slate-500">
                      {PRICING.period}
                    </div>
                  </div>
                </div>
                <div
                  className="hidden sm:flex items-center rounded-full px-4 py-2 text-xs font-semibold border"
                  style={{
                    color: 'var(--brand-blue)',
                    borderColor: 'color-mix(in srgb, var(--brand-blue) 18%, rgb(226 232 240))',
                    backgroundColor: 'color-mix(in srgb, var(--bg-soft) 70%, white)',
                  }}
                >
                  Early access
                </div>
              </div>

              <div className="mt-8">
                <div className="text-md font-semibold text-slate-700">
                  What’s included
                </div>
                <ul className="mt-4 space-y-6">
                  {PRICING.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2 inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: 'var(--accent-blue)' }}
                        aria-hidden
                      />
                      <span className="text-base sm:text-lg text-slate-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <PrimaryButton
                  size="lg"
                  fullWidth
                  onClick={() => navigate(ROUTES.SIGNUP)}
                >
                  {PRICING.cta}
                </PrimaryButton>
                <p className="mt-4 text-center text-xs sm:text-sm text-slate-500">
                  {PRICING.reassurance}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
