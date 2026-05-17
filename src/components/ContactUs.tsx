import { en } from '../assets/lang/en';
import PrimaryButton from './PrimaryButton';
import { BlueSectionBackdrop } from './BlueSection';
import { SECTION_HEADING, SECTION_SUBHEADING_LIGHT } from '../constants/sectionTypography';

const t = en.contactUs;

export default function ContactUs() {
  const mailtoHref = `mailto:${t.email}?subject=${encodeURIComponent('Path of Wonders — contact')}`;

  return (
    <section className="w-full bg-blue-100 relative overflow-hidden lg:min-h-screen lg:flex lg:items-center py-16 sm:py-20 md:py-24">
      <BlueSectionBackdrop variant="classic" />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start lg:items-center">
          <div className="text-left lg:col-span-3 motion-safe:animate-fade-in">
            <h2
              className={`${SECTION_HEADING} py-6`}
              style={{ color: 'var(--brand-blue)' }}
            >
              {t.heading}
            </h2>
            <p className={`mt-6 sm:mt-8 max-w-2xl text-slate-700 ${SECTION_SUBHEADING_LIGHT}`}>
              {t.subheading}
            </p>
          </div>

          <div className="w-full lg:col-span-2 motion-safe:animate-fade-in motion-safe:[animation-delay:120ms]">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-lg p-7 sm:p-9 md:p-10">
              <ul className="space-y-6">
                {t.details.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: 'var(--accent-blue)' }}
                      aria-hidden
                    />
                    <span className="text-base sm:text-lg text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.emailLabel}</p>
                <a
                  href={mailtoHref}
                  className="mt-2 block text-xl sm:text-2xl font-semibold break-all hover:underline"
                  style={{ color: 'var(--brand-blue)' }}
                >
                  {t.email}
                </a>
                <p className="mt-4 text-sm text-slate-500">{t.responseNote}</p>
              </div>

              <div className="mt-10">
                <PrimaryButton size="lg" fullWidth href={mailtoHref}>
                  {t.cta}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
