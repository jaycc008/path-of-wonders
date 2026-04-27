import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import FinalCTA from '../components/FinalCTA';
import heroBackground from '../assets/images/teenparent.jpeg';
import ruudPhoto from '../assets/images/businessman.jpg';
import { en } from '../assets/lang/en';

const t = en.about;

const sectionBody =
  'max-w-3xl space-y-6 text-base leading-relaxed text-slate-700 sm:text-lg md:text-xl';

export default function AboutPage() {
    const ruudRef = useRef<HTMLDivElement | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-7');
                    }
                });
            },
            { threshold: 0.12 },
        );
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen w-full bg-white text-slate-900">
            <Header />

            <div className="about-root w-full overflow-x-hidden">
                {/* ── HERO ── */}
                <section className="hero relative overflow-hidden lg:min-h-screen">
                  <div
                    className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat md:bg-fixed"
                    style={{
                      backgroundImage: `url(${heroBackground})`,
                      backgroundPosition: 'right center',
                      /* Zoom from right edge so more of the frame reads from the right half (clipped by section overflow-hidden) */
                      transform: 'scale(0.9)',
                      transformOrigin: 'right center',
                    }}
                    aria-hidden
                  />
                  {/* Light band on the left — reads as open space; keeps layout within bounds (no scrollX) */}
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-white from-[6%] via-white/90 via-[28%] to-transparent to-[62%]"
                    aria-hidden
                  />

                  <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-6 py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center lg:py-24">
                    <div className="w-full lg:flex lg:min-h-0 lg:flex-col lg:justify-center">
                      <h1
                        className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-8xl md:py-10"
                       
                      >
                        Why this exists
                      </h1>
                      <div className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:240ms] mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-slate-200 sm:text-lg md:text-xl lg:max-w-none">
                        <blockquote
                          className="border-l-[3px] py-1 pl-5 italic text-slate-700 sm:pl-6 md:pl-8 md:border-l-4 space-y-3 md:space-y-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                          style={{ borderColor: 'var(--accent-blue)' }}
                        >
                          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-slate-800">
                            School has a problem.
                          </p>
                          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-slate-800">
                            Not with teachers. Not with students.
                          </p>
                          <p
                            className="text-lg leading-relaxed font-semibold text-slate-50 sm:text-xl md:text-2xl"
                            style={{ color: 'var(--brand-blue)' }}
                          >
                            With questions.
                          </p>
                        </blockquote>
                        <p className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:360ms] text-base leading-relaxed text-slate-900 sm:text-lg md:text-xl max-w-xl">
                          When a student asks something that does not fit the lesson plan, the lesson moves on.
                          When a teenager starts wondering why the financial system works the way it does, or what
                          attention actually is, or what is really true versus what they have simply been told, there
                          is no space for that in a classroom of 32 people working toward a test.
                        </p>
                        <p className="text-slate-900 max-w-2xl font-bold ">
                          So the question gets buried. And the teenager learns, slowly, that curiosity is something to
                          manage rather than follow.
                        </p>
                        <p className="py-3 text-xl font-semibold text-slate-900 drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
                          Path of Wonders was built for the teenagers who never stopped asking.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

               

                {/* ── WHAT IT IS ── */}
                <div className="section mx-auto max-w-7xl px-5 md:px-6 py-16 sm:py-20 lg:min-h-screen lg:flex lg:items-center">
                    <div className="section-inner w-full grid grid-cols-1 gap-12 md:grid-cols-[520px_1fr] md:gap-16 md:items-center">
                        <div>
                            <h2
                                className="section-label reveal opacity-0 translate-y-7 transition-all duration-700 ease-out text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-10"
                                style={{ color: 'var(--brand-blue)' }}
                            >
                                What it is
                            </h2>
                            <h3 className="reveal  opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl md:leading-tight italic">
                                A cinematic education universe.
                            </h3>
                            <p className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:240ms] mt-6 max-w-none text-base leading-relaxed text-slate-700 sm:text-lg md:text-xl">
                                Anime-quality stories that follow teenagers through the questions school never makes room for.
                            </p>
                        </div>
                        <div className="section-body self-center">

                            <ul className="feature-list mt-8 border-t border-slate-200">
                                {[
                                    'How the algorithm was designed to capture your attention and what you can do about it.',
                                    'How money actually works and why nobody taught you.',
                                    'What the mind is capable of when you stop filling every quiet moment with noise.',
                                    'What it means to ask whether something is really true.',
                                ].map((item, i) => (
                                    <li
                                        className="feature-item reveal opacity-0 translate-y-7 transition-all duration-700 ease-out grid grid-cols-[20px_1fr] gap-4 py-4 border-b border-slate-200"
                                        style={{ transitionDelay: `${160 + 70 * (i + 1)}ms` }}
                                        key={i}
                                    >
                                        <span className="pt-2">
                                            <span
                                                className="feature-dot block h-2 w-2 rounded-full"
                                                style={{ backgroundColor: 'var(--accent-blue)' }}
                                                aria-hidden
                                            />
                                        </span>
                                        <span className="feature-text text-sm sm:text-base md:text-xl leading-relaxed text-slate-700">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <p className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:520ms] mt-8 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg md:text-2xl">
                                The story arrives as cinematic video and as a hardcover book. The exercises arrive at the end of
                                each episode and each chapter. The journal is where the thinking continues. The real-world quests
                                are where the story leaves the room and enters actual life.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-5 md:px-6">
                  <hr className="border-slate-200" />
                </div>

                {/* ── WHERE IT CAME FROM ── */}
                <section className="mx-auto max-w-7xl px-5 md:px-6 py-16 sm:py-20 lg:min-h-screen lg:flex lg:items-center lg:py-24">
                  <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-[minmax(0,440px)_1fr] md:gap-16 md:items-start">
                    <div>
                      <h2
                        className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-10"
                        style={{ color: 'var(--brand-blue)' }}
                      >
                        {t.whereItCameFromHeading}
                      </h2>
                      <p className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] mt-4 text-lg italic text-slate-600 sm:text-xl md:text-2xl">
                        A question that changed everything.
                      </p>
                    </div>
                    <div className={`${sectionBody} max-w-none`}>
                      <p className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:180ms]">
                        {t.whereItCameFromBody[0]}
                      </p>
                      <blockquote
                        className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:240ms] border-l-[3px] py-1 pl-5 italic text-slate-800 sm:pl-6 md:border-l-4 md:pl-8"
                        style={{ borderColor: 'var(--accent-blue)' }}
                      >
                        <p className="text-lg leading-relaxed sm:text-xl md:text-2xl">{t.whereItCameFromBody[1]}</p>
                        <p className="mt-4 text-base not-italic leading-relaxed text-slate-700 sm:text-lg md:text-xl">
                          {t.whereItCameFromBody[2]}
                        </p>
                      </blockquote>
                      {t.whereItCameFromBody.slice(3).map((paragraph, idx) => (
                        <p
                          key={paragraph}
                          className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out text-slate-700"
                          style={{ transitionDelay: `${320 + idx * 60}ms` }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ── RUUD PHOTO ── */}
                <section
                  ref={ruudRef}
                  className="w-full border-t border-slate-100 bg-white py-12 sm:py-16 md:py-20"
                >
                  <div className="mx-auto max-w-7xl px-5 md:px-6">
                    <div className="grid max-w-5xl grid-cols-1 gap-10 md:mx-auto lg:grid-cols-2 lg:items-center lg:gap-14">
                      <div className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                        <img
                          src={ruudPhoto}
                          alt={t.ruudImageAlt}
                          className="aspect-[4/5] w-full object-cover sm:aspect-[5/6] md:aspect-[3/4]"
                          decoding="async"
                          loading="lazy"
                        />
                      </div>
                      <div className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] space-y-3">
                        <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Ruud</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Founder, Path of Wonders
                        </p>
                        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                          Physics teacher. Wanderer. Builder of spaces for questions. From Rotterdam to Varanasi and
                          back again, still asking the same things.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="mx-auto max-w-7xl px-5 md:px-6">
                  <hr className="border-slate-200" />
                </div>

                {/* ── WHO IT IS FOR ── */}
                <section className="w-full bg-white py-16 sm:py-20 md:py-24">
                  <div className="mx-auto max-w-7xl px-5 md:px-6">
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
                      <h2
                        className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                        style={{ color: 'var(--navy)' }}
                      >
                        {t.whoItIsForHeading}
                      </h2>
                      <ul className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] space-y-8">
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
                    </div>
                  </div>
                </section>

                <div className="mx-auto max-w-7xl px-5 md:px-6">
                  <hr className="border-slate-200" />
                </div>

                {/* ── WHAT IS COMING (+ closing line) ── */}
                <section className="border-t border-slate-100 bg-slate-50/70">
                  <div className="mx-auto max-w-7xl px-5 md:px-6 py-16 sm:py-20 lg:min-h-screen lg:flex lg:items-center lg:py-24">
                    <div className="w-full">
                      <h2
                        className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out text-4xl font-bold tracking-tight sm:text-5xl md:text-8xl md:py-10"
                        style={{ color: 'var(--brand-blue)' }}
                      >
                        {t.whatIsComingHeading}
                      </h2>
                      <div className={`reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] mt-8 sm:mt-10 ${sectionBody}`}>
                        <p>{t.whatIsComingBody[0]}</p>
                        <p className="pt-10 text-center text-xl font-semibold italic text-slate-800 sm:text-2xl md:text-3xl">
                          {t.whatIsComingBody[1]}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── CTA ── */}
                <section className="border-t border-slate-200 bg-slate-950 py-16 sm:py-20">
                  <div className="mx-auto max-w-lg px-5 text-center md:px-6">
                    <h2 className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Enter the Universe
                    </h2>
                    <div className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] mt-8">
                      <Link
                        to="/courses"
                        className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100 sm:px-10 sm:py-4 sm:text-lg"
                      >
                        Enter the Universe
                      </Link>
                    </div>
                    <p className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:240ms] mt-8 text-sm text-slate-400">
                      <a href="/books" className="underline decoration-slate-600 underline-offset-4 transition hover:text-slate-200">
                        Not ready yet? Get the free guide.
                      </a>
                    </p>
                  </div>
                </section>
            </div>

            <FinalCTA />
            <Footer />
            <ScrollToTop show={showScrollTop} />
        </div>
    );
}