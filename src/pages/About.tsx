import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import FinalCTA from '../components/FinalCTA';
import { en } from '../assets/lang/en';
import ruudPhoto from '../assets/images/businessman.jpg';

const t = en.about;

type Chapter = {
  number: string;
  heading: string;
  body: readonly string[];
};

const CHAPTERS: Chapter[] = [
  { number: '01', heading: t.whatItIsHeading, body: t.whatItIsBody },
  { number: '02', heading: t.whereItCameFromHeading, body: t.whereItCameFromBody },
  { number: '04', heading: t.whatIsComingHeading, body: t.whatIsComingBody },
];

const HERO_POINTS = [t.problemHeading, t.problemBody[0], t.problemBody[1]] as const;
const HERO_STORY = t.problemBody.slice(2);

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
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="pt-12">
        {/* HERO — full-width header (blue-600), 3 beats, then story */}
        <section className="min-h-screen flex items-center border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-5 md:px-6 w-full py-14 sm:py-16">
            <header className="w-full text-blue-900">
              <p className="text-xs sm:text-sm uppercase tracking-[0.35em]">
                About Path of Wonders
              </p>
              <h1 className="mt-6 w-full text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tight leading-[0.95]">
                {t.pageTitle}
              </h1>
            </header>

            <ol className="mt-12 lg:mt-16 w-full list-none space-y-0 border-y border-slate-200/80">
              {HERO_POINTS.map((line, i) => (
                <li
                  key={`${i}-${line}`}
                  className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8 md:gap-10 items-start border-b border-slate-200/80 py-8 sm:py-10 last:border-b-0"
                >
                  <span
                    className="select-none font-semibold tabular-nums text-3xl sm:text-4xl leading-none text-slate-200 sm:pt-1"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="min-w-0 text-xl sm:text-2xl md:text-3xl font-medium leading-snug text-[var(--navy)] tracking-tight">
                    {line}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-12 lg:mt-16 max-w-7xl space-y-6 text-lg sm:text-xl leading-relaxed text-slate-700">
              {HERO_STORY.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 01 — What it is */}
        <Chapter chapter={CHAPTERS[0]} />

        {/* 02 — Where it came from (+ pull quote + full-bleed Ruud photo) */}
        <section className="min-h-screen flex items-center border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-5 md:px-6 w-full py-14 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-6">
                  <span className="text-6xl sm:text-7xl font-semibold tracking-tight text-slate-200 leading-none">
                    {CHAPTERS[1].number}
                  </span>
                  <span className="h-px w-16 bg-slate-300 translate-y-[-0.6em]" aria-hidden />
                </div>
                <h2 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-slate-900">
                  {CHAPTERS[1].heading}
                </h2>
              </div>

              <div className="lg:col-span-7">
                <div className="space-y-6 text-lg sm:text-xl leading-relaxed text-slate-700">
                  <p className="text-2xl sm:text-3xl font-medium leading-snug text-slate-900 border-l-2 border-slate-900 pl-6">
                    {CHAPTERS[1].body[0]}
                  </p>
                  {CHAPTERS[1].body.slice(1).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Founder portrait" className="border-t border-slate-200">
          <div className="relative w-full">
            <img
              src={ruudPhoto}
              alt={t.ruudImageAlt}
              className="w-full h-[60vh] sm:h-[75vh] lg:h-[90vh] object-cover"
              decoding="async"
            />
          </div>
        </section>

        {/* 03 — Who it is for (editorial numbered bullets) */}
        <section className="min-h-screen flex items-center border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-5 md:px-6 w-full py-14 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-6">
                  <span className="text-6xl sm:text-7xl font-semibold tracking-tight text-slate-200 leading-none">
                    03
                  </span>
                  <span className="h-px w-16 bg-slate-300 translate-y-[-0.6em]" aria-hidden />
                </div>
                <h2 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-slate-900">
                  {t.whoItIsForHeading}
                </h2>
              </div>

              <div className="lg:col-span-7">
                <ul className="divide-y divide-slate-200">
                  {t.whoItIsForBullets.map((item, i) => (
                    <li key={item} className="py-6 sm:py-8 flex gap-6">
                      <span className="text-sm font-semibold tracking-[0.25em] text-slate-400 pt-2 w-10 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-lg sm:text-xl leading-relaxed text-slate-800">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — What is coming */}
        <Chapter chapter={CHAPTERS[2]} />
      </main>

      <FinalCTA />
      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}

function Chapter({ chapter }: { chapter: Chapter }) {
  return (
    <section className="min-h-screen flex items-center border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-5 md:px-6 w-full py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-6">
              <span className="text-6xl sm:text-7xl font-semibold tracking-tight text-slate-200 leading-none">
                {chapter.number}
              </span>
              <span className="h-px w-16 bg-slate-300 translate-y-[-0.6em]" aria-hidden />
            </div>
            <h2 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-slate-900">
              {chapter.heading}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-6 text-lg sm:text-xl leading-relaxed text-slate-700">
              {chapter.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
