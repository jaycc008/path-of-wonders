import { useNavigate } from 'react-router-dom';
import featuredArt from '../assets/images/A Single Path Disappearing Into Golden Light — Metaphor for the journey. Warm, hopeful, forward-moving..png';
import scienceOfWonderArt from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM (2).jpeg';
import inheritanceQuestArt from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.05 PM.jpeg';
import CourseCard, { type CourseCardModel } from './CourseCard';

export default function Courses() {
  const navigate = useNavigate();

  const series: readonly CourseCardModel[] = [
    {
      title: 'Attention Heist',
      description: 'Your attention is being harvested. This is how you take it back.',
      tag: 'The Attention Crisis Start Here',
      featured: true,
      image: featuredArt,
    },
    {
      title: 'Science of Wonder',
      description: 'Four teenagers. One fellowship. The questions that actually matter.',
      featured: false,
      image: scienceOfWonderArt,
    },
    {
      title: 'Inheritance Quest',
      description:
        'How money, identity, and family shape a life before school teaches you none of it.',
      featured: false,
      image: inheritanceQuestArt,
    },
  ] as const;

  return (
    <section className="py-18 sm:py-22 md:py-28 relative overflow-hidden lg:h-[120vh]">
      {/* Dark mysterious backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_18%_22%,rgba(99,102,241,0.22)_0%,rgba(0,0,0,0)_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_82%_18%,rgba(56,189,248,0.14)_0%,rgba(0,0,0,0)_62%)]"
        aria-hidden
      />
      {/* Crossing lines */}
      <div className="pointer-events-none absolute inset-0 opacity-35" aria-hidden>
        <div className="absolute -left-40 top-12 h-[2px] w-[160%] rotate-[8deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <div className="absolute -left-40 top-44 h-px w-[160%] rotate-[8deg] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute -right-40 top-28 h-[2px] w-[160%] -rotate-[10deg] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute -right-40 top-60 h-px w-[160%] -rotate-[10deg] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      {/* Subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_85%_at_50%_45%,rgba(0,0,0,0)_35%,rgba(2,6,23,0.72)_100%)]"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 lg:my-auto">
        <div className="text-left mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
            The Universe
          </h2>
          <p className="text-xl sm:text-2xl md:text-2xl text-slate-200/95 leading-relaxed lg:max-w-5xl">
            Three cinematic series. One world. Built for the minds that question everything.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {series.map((s) => {
            return (
              <CourseCard
                key={s.title}
                course={s}
                onExplore={() => navigate('/courses')}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

