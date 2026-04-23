import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import FinalCTA from '../components/FinalCTA';
import PrimaryButton from '../components/PrimaryButton';
import BlueSection from '../components/BlueSection';
import { ROUTES } from '../constants/routes';
import { en } from '../assets/lang/en';
import imgJournal from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.05 PM.jpeg';

const t = en.books;

const IMG_BOOKS_HERO =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1400&q=80';

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

export default function BooksPage() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <Header />

      <main className="w-full">
        {/* Hero — intro copy exactly as written */}
        <BlueSection backdrop="classic" className="py-16 sm:py-20 md:py-24">
          <div className="w-full lg:flex lg:min-h-[100vh] lg:items-center lg:py-16">
            <div className="mx-auto w-full min-w-0 max-w-7xl px-5 md:px-6">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <div className="text-left motion-safe:animate-fade-in">
                  <h1
                    className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                    style={{ color: 'var(--brand-blue)' }}
                  >
                    {/^the\s+books$/i.test(t.heading.trim()) ? (
                      <>
                        The <span className="italic">Books</span>
                      </>
                    ) : (
                      t.heading
                    )}
                  </h1>

                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl md:text-4xl">
                    {t.subheading}
                  </p>

                  <div className={`mt-8 ${sectionBodyClass}`}>
                    {t.intro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="motion-safe:animate-fade-in motion-safe:[animation-delay:120ms]">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                    <img
                      src={IMG_BOOKS_HERO}
                      alt="Hardcover books on a table"
                      className="aspect-[4/5] w-full object-cover sm:aspect-[5/6] lg:max-h-[min(72vh,720px)]"
                      width={1400}
                      height={1750}
                      decoding="async"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlueSection>

        {/* What is inside */}
        <BlueSection backdrop="diagonal" className="py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-6 text-center">
            <Reveal>
              <h2
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                style={{ color: 'var(--brand-blue)' }}
              >
                {t.insideHeading}
              </h2>
            </Reveal>
            <div className={`mx-auto mt-8 max-w-3xl space-y-6 text-base leading-relaxed text-slate-700 sm:mt-10 sm:text-lg md:text-xl`}>
              {t.insideBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </BlueSection>

        {/* The journal */}
        <section className="w-full bg-white py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-6">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <Reveal>
                <h2
                  className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                  style={{ color: 'var(--navy)' }}
                >
                  {t.journalHeading}
                </h2>
                <div className={`mt-6 sm:mt-8 ${sectionBodyClass}`}>
                  {t.journalBody.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg lg:mt-0">
                  <img
                    src={imgJournal}
                    alt="Notebook and pen for journaling"
                    className="aspect-[4/5] w-full max-w-md object-cover lg:mx-auto lg:ml-auto"
                    width={1200}
                    height={1500}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Before you buy */}
        <BlueSection
          backdrop="sweep"
          className="border-t border-slate-200/80"
          ariaLabelledBy="books-before-heading"
        >
          <div className="w-full lg:flex lg:h-[100vh] lg:items-center">
            <div className="mx-auto w-full min-w-0 max-w-7xl px-6 py-14 md:px-12 md:py-32">
              <div className="w-full rounded-3xl md:p-10 lg:p-12">
                <div className="flex flex-col gap-8 md:gap-10">
                  <Reveal>
                    <h2
                      id="books-before-heading"
                      className="text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                      style={{ color: 'var(--brand-blue)' }}
                    >
                      {t.beforeYouBuyHeading}
                    </h2>
                  </Reveal>

                  <div className={`${sectionBodyClass} max-w-none md:max-w-3xl`}>
                    {t.beforeYouBuyBody.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>

                  <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <PrimaryButton type="button" size="lg" className="sm:min-w-[220px]">
                      Read first chapter
                    </PrimaryButton>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.COURSES)}
                      className="inline-flex h-12 min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:min-w-[220px] sm:px-8"
                    >
                      See all series
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
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
