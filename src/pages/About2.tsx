import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import FinalCTA from '../components/FinalCTA';
import heroBackground from '../assets/images/teenparent.jpeg';

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
                    className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${heroBackground})` }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/65 via-slate-950/45 to-slate-950/75"
                    aria-hidden
                  />
                  <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-6 py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center lg:py-24">
                    <div className="w-full lg:flex lg:min-h-0 lg:flex-col lg:justify-center">
                      <h1
                        className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] mt-4 text-4xl font-bold tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:text-5xl md:text-7xl md:py-6"
                        style={{ color: 'var(--brand-blue)' }}
                      >
                        Why this exists
                      </h1>
                      <div className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:240ms] mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-slate-200 sm:text-lg md:text-xl lg:max-w-none">
                        <blockquote
                          className="border-l-[3px] py-1 pl-5 italic text-white sm:pl-6 md:pl-8 md:border-l-4 space-y-3 md:space-y-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                          style={{ borderColor: 'var(--accent-blue)' }}
                        >
                          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-slate-100">
                            School has a problem.
                          </p>
                          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-slate-100">
                            Not with teachers. Not with students.
                          </p>
                          <p
                            className="text-lg leading-relaxed font-semibold text-slate-50 sm:text-xl md:text-2xl"
                            style={{ color: 'var(--brand-blue)' }}
                          >
                            With questions.
                          </p>
                        </blockquote>
                        <p className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:360ms] text-base leading-relaxed text-slate-200 sm:text-lg md:text-xl">
                          When a student asks something that does not fit the lesson plan, the lesson moves on.
                          When a teenager starts wondering why the financial system works the way it does, or what
                          attention actually is, or what is really true versus what they have simply been told, there
                          is no space for that in a classroom of 32 people working toward a test.
                        </p>
                        <p className="text-slate-200">
                          So the question gets buried. And the teenager learns, slowly, that curiosity is something to
                          manage rather than follow.
                        </p>
                        <p className="py-3 text-xl font-semibold text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
                          Path of Wonders was built for the teenagers who never stopped asking.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="divider mx-auto max-w-7xl px-5 md:px-6">
                    <hr />
                </div>

                {/* ── WHAT IT IS ── */}
                <div className="section mx-auto max-w-7xl px-5 md:px-6 py-16 sm:py-20 lg:min-h-screen lg:flex lg:items-center">
                    <div className="section-inner w-full grid grid-cols-1 gap-12 md:grid-cols-[520px_1fr] md:gap-16 md:items-center">
                        <div>
                            <h2
                                className="section-label reveal opacity-0 translate-y-7 transition-all duration-700 ease-out text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl md:py-6"
                                style={{ color: 'var(--brand-blue)' }}
                            >
                                What it is
                            </h2>
                            <h3 className="reveal opacity-0 translate-y-7 transition-all duration-700 ease-out [transition-delay:120ms] mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl md:leading-tight italic">
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

                <div className="divider">
                    <hr />
                </div>

                {/* ── WHERE IT CAME FROM ── */}
                <div className="section">
                    <div className="section-inner">
                        <div>
                            <p className="section-label reveal">Where it came from</p>
                        </div>
                        <div className="section-body">
                            <h2 className="reveal reveal-delay-1">A question that changed everything.</h2>
                            <p className="reveal reveal-delay-2">
                                A physics teacher in Rotterdam was explaining what the inside of the Earth looks like. A student
                                asked how anyone could know that, since nobody had ever been there.
                            </p>
                            <div className="pull-quote reveal reveal-delay-2">
                                <p>
                                    The teacher went quiet for about ten seconds. In those ten seconds he realized he did not
                                    actually know.
                                </p>
                            </div>
                            <p className="reveal">
                                He believed the scientists had done a great job. That is not the same thing. And nobody in that
                                school had ever given that student a space to ask that question before.
                            </p>
                            <p className="reveal">
                                A few weeks later the teacher stopped his training, bought a one-way ticket to India, and spent
                                years sitting with the same kind of questions. India and Nepal changed a lot. Varanasi especially.
                                Long silences. The ghats at night. The oldest stories humans ever told, still trying to answer what
                                one student in Rotterdam had asked.
                            </p>
                            <p className="reveal">
                                When he came back, he went back into classrooms. Different countries. Same teenagers in the back
                                row with real questions and nowhere to take them.
                            </p>
                            <p className="reveal">Path of Wonders is what he built for them.</p>
                        </div>
                    </div>
                </div>

                {/* ── RUUD PHOTO ── */}
                <div className="photo-block" ref={ruudRef}>
                    <div className="photo-inner">
                        <div className="photo-frame reveal">
                            <div className="photo-placeholder">
                                <div className="photo-placeholder-icon">
                                    <svg viewBox="0 0 24 24">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                    </svg>
                                </div>
                                <p className="photo-placeholder-text">Photo — Ruud, natural light, outside</p>
                            </div>
                        </div>
                        <div className="photo-caption reveal reveal-delay-2">
                            <p className="photo-caption-name">Ruud</p>
                            <p className="photo-caption-role">Founder, Path of Wonders</p>
                            <p>
                                Physics teacher. Wanderer. Builder of spaces for questions. From Rotterdam to Varanasi and back
                                again, still asking the same things.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="divider">
                    <hr />
                </div>

                {/* ── WHO IT IS FOR ── */}
                <div className="section">
                    <div className="section-inner">
                        <div>
                            <p className="section-label reveal">Who it is for</p>
                        </div>
                        <div className="section-body">
                            <h2 className="reveal reveal-delay-1">Three kinds of people.</h2>
                            <div className="audience-grid">
                                {[
                                    {
                                        n: '01',
                                        text: 'Teenagers between 13 and 18 who feel like the questions they actually have are not the questions anyone around them wants to answer.',
                                    },
                                    {
                                        n: '02',
                                        text: 'Parents who know their child is capable of more than grades show, and who wish something like this had existed when they were fifteen.',
                                    },
                                    {
                                        n: '03',
                                        text: 'Families who believe that the right story, told well, can change how a young person sees themselves and the world.',
                                    },
                                ].map((item, i) => (
                                    <div className={`audience-card reveal reveal-delay-${i + 1}`} key={i}>
                                        <div className="audience-number">{item.n}</div>
                                        <p className="audience-text">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divider">
                    <hr />
                </div>

                {/* ── WHAT IS COMING ── */}
                <div className="section">
                    <div className="section-inner">
                        <div>
                            <p className="section-label reveal">What is coming</p>
                        </div>
                        <div className="section-body">
                            <h2 className="reveal reveal-delay-1">A universe that grows slowly.</h2>
                            <div className="coming-block reveal reveal-delay-2">
                                <div className="coming-stats">
                                    <div>
                                        <p className="stat-value">3</p>
                                        <p className="stat-label">Series live or in production</p>
                                    </div>
                                    <div>
                                        <p className="stat-value">50+</p>
                                        <p className="stat-label">Series planned</p>
                                    </div>
                                    <div>
                                        <p className="stat-value">∞</p>
                                        <p className="stat-label">Questions worth asking</p>
                                    </div>
                                </div>
                                <p className="coming-body">
                                    Three series are live or in production now. Fifty more are planned. The universe will grow
                                    slowly, one series at a time, each one built around a question worth asking.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TAGLINE ── */}
                <div className="tagline-section">
                    <p className="tagline reveal">For the minds that question everything.</p>
                    <p className="tagline-sub reveal reveal-delay-1">Path of Wonders</p>
                </div>

                {/* ── CTA ── */}
                <div className="cta-section">
                    <div className="cta-inner">
                        <h2 className="cta-title reveal">Enter the Universe</h2>
                        <div className="reveal reveal-delay-1">
                            <a href="#" className="cta-btn">
                                Enter the Universe
                            </a>
                        </div>
                        <a href="#" className="cta-soft reveal reveal-delay-2">
                            Not ready yet?&nbsp;<span>Get the free guide.</span>
                        </a>
                    </div>
                </div>
            </div>

            <FinalCTA />
            <Footer />
            <ScrollToTop show={showScrollTop} />
        </div>
    );
}