import { useEffect, useRef, useState, type ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import FinalCTA from '../components/FinalCTA';
import BlueSection from '../components/BlueSection';
import { en } from '../assets/lang/en';
import ruudPhoto from '../assets/images/businessman.jpg';

const t = en.about;

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0px)' : 'translateY(36px)',
        transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const sectionBodyClass =
  'max-w-3xl space-y-6 text-base leading-relaxed text-slate-700 sm:text-lg md:text-xl';

export default function About() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <Header />

      <main className="w-full">
        {/* Hero — BooksPage-style: blue band, max-w-7xl content, 2-col + image */}
        <BlueSection backdrop="diagonal" className="py-16 sm:py-20 md:py-24">
          <div className="w-full lg:flex lg:min-h-[100vh] lg:items-center lg:py-16">
            <div className="mx-auto w-full min-w-0 max-w-7xl px-5 md:px-6">
              <div className="grid grid-cols-1 items-center gap-10">
                <div className="text-left motion-safe:animate-fade-in">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    About Path of Wonders
                  </p>
                  <h1
                    className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                    style={{ color: 'var(--brand-blue)' }}
                  >
                    {t.pageTitle}
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl md:text-4xl">
                    {t.problemHeading}
                  </p>
                  <div className={`mt-8 ${sectionBodyClass}`}>
                    {t.problemBody.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlueSection>

        {/* What it is */}
        <BlueSection backdrop="mist" className="py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <Reveal>
              <h2
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                style={{ color: 'var(--brand-blue)' }}
              >
                {t.whatItIsHeading}
              </h2>
            </Reveal>
            <div className={`mt-8 sm:mt-10 ${sectionBodyClass}`}>
              {t.whatItIsBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </BlueSection>

        {/* Where it came from */}
        <BlueSection backdrop="grid" className="border-t border-slate-200/80 py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <Reveal>
              <h2
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                style={{ color: 'var(--brand-blue)' }}
              >
                {t.whereItCameFromHeading}
              </h2>
            </Reveal>
            <div className={`mt-8 sm:mt-10 ${sectionBodyClass}`}>
              {t.whereItCameFromBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </BlueSection>

        {/* Ruud photo — placed after "Where it came from" (lower half of page) */}
        <section className="w-full bg-white py-12 sm:py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <Reveal>
              <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                  <img
                    src={ruudPhoto}
                    alt={t.ruudImageAlt}
                    className="aspect-[4/5] w-full object-cover sm:aspect-[5/6] md:aspect-[3/4]"
                    decoding="async"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Who it is for — Books-style white band, 2-col */}
        <section className="w-full bg-white py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal>
                <h2
                  className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                  style={{ color: 'var(--navy)' }}
                >
                  {t.whoItIsForHeading}
                </h2>
              </Reveal>

              <Reveal delay={120}>
                <ul className="space-y-8">
                  {t.whoItIsForBullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: 'var(--accent-blue)' }}
                        aria-hidden
                      />
                      <span className="text-base leading-relaxed text-slate-700 sm:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* What is coming */}
        <BlueSection
          backdrop="bloom"
          className="border-t border-slate-200/80 lg:flex lg:h-[100vh] lg:items-center"
          ariaLabelledBy="about-coming-heading"
        >
          <div className="w-full lg:py-24">
            <div className="mx-auto w-full min-w-0 max-w-7xl px-6 py-14 md:px-12 md:py-24">
              <div className="w-full rounded-3xl md:p-10 lg:p-12">
                <div className="flex flex-col gap-8 md:gap-10">
                  <Reveal>
                    <h2
                      id="about-coming-heading"
                      className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                      style={{ color: 'var(--brand-blue)' }}
                    >
                      {t.whatIsComingHeading}
                    </h2>
                  </Reveal>
                  <div className={`${sectionBodyClass} max-w-none md:max-w-3xl`}>
                    {t.whatIsComingBody.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlueSection>
      </main>

      <FinalCTA />
      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}
