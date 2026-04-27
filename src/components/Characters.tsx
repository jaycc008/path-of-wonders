import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { en } from '../assets/lang/en';

import amaraImg from '../assets/images/characters/amara.jpeg';
import bodhiImg from '../assets/images/characters/bodi.jpeg';
import devinImg from '../assets/images/characters/devon.jpg';
import kaiImg from '../assets/images/characters/kai.jpeg';
import leilaImg from '../assets/images/characters/leila.jpeg';
import marcusImg from '../assets/images/characters/marcus.jpeg';
import priyaImg from '../assets/images/characters/priya.jpg';
import shennaImg from '../assets/images/characters/sienna.jpeg';
import zaraImg from '../assets/images/characters/zara.jpeg';

const t = en.characters;

type CharacterId = (typeof t.cards)[number]['id'];

const imagesById: Record<CharacterId, string> = {
  zara: zaraImg,
  marcus: marcusImg,
  leila: leilaImg,
  bodhi: bodhiImg,
  amara: amaraImg,
  kai: kaiImg,
  shenna: shennaImg,
  priya: priyaImg,
  devin: devinImg,
};

export default function Characters() {
  const navigate = useNavigate();

  const cards = useMemo(() => {
    return t.cards.map((c) => ({
      ...c,
      image: imagesById[c.id],
      imageAlt: `${c.name} character artwork`,
    }));
  }, []);

  return (
    <section className="py-18 sm:py-22 md:py-28 relative overflow-hidden">
      {/* Cinematic dark / duotone backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/75 to-slate-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_56%_at_18%_22%,rgba(59,130,246,0.18)_0%,rgba(0,0,0,0)_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(56%_50%_at_82%_18%,rgba(236,72,153,0.12)_0%,rgba(0,0,0,0)_64%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,rgba(0,0,0,0)_36%,rgba(2,6,23,0.78)_100%)]"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-left mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-5 leading-tight tracking-tight py-10">
            {t.heading}
          </h2>
          <p className="text-xl sm:text-2xl md:text-5xl text-slate-200/95 leading-relaxed lg:max-w-5xl">
            {t.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {cards.map((c) => (
            <article
              key={c.id}
              className={[
                'group relative overflow-hidden rounded-2xl border border-slate-200 my-4',
                'transition-transform duration-300 ease-out hover:-translate-y-1',
              ].join(' ')}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.imageAlt}
                  className={[
                    'h-full w-full object-cover object-top',
                    'transition-opacity duration-300 ease-out',
                  ].join(' ')}
                  loading="lazy"
                />

                {/* Duotone / film reveal overlays */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-60 bg-[radial-gradient(80%_70%_at_50%_20%,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_55%)]"
                  aria-hidden
                />
              </div>

              {/* Copy */}
              <div className="p-6 sm:p-7">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {c.name}
                  </h3>
                  {'age' in c && typeof c.age === 'number' ? (
                    <span className="text-sm sm:text-base text-slate-300/90">
                      {c.age}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-200/90">
                  {c.line}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Optional CTA */}
        <div className="mt-10 sm:mt-12 md:mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className={[
              'inline-flex items-center justify-center',
              'rounded-full px-6 py-3 sm:px-7 sm:py-3.5',
              'text-base sm:text-lg font-semibold',
              'bg-white text-slate-950 hover:bg-white/90',
              'shadow-[0_10px_30px_rgba(0,0,0,0.35)]',
              'transition',
            ].join(' ')}
          >
            {t.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
