import { Link } from 'react-router-dom';
import { en } from '../assets/lang/en';
import founderImage from '../assets/images/businessman.jpg';

const t = en.founderStory;

export default function FounderStory() {
  return (
    <section
      className="w-full bg-white relative  lg:min-h-[100vh] lg:flex lg:items-center py-16 sm:py-20 md:py-24"
    >
      <div className="max-w-7xl w-full mx-auto px-5 md:px-6 ">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="order-1">
            <div className=" max-w-1xl mx-auto absolute bottom-0">
              <img
                src={founderImage}
                alt={t.imageAlt}
                className="w-full h-[520px] sm:h-[620px] lg:h-[760px] object-cover object-bottom"
                decoding="async"
              />
            </div>
          </div>

          <div className="order-2 relative z-20 overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-12 top-2 h-56 w-72 rounded-[3rem] bg-gray-200/60 rotate-6" />
              <div className="absolute right-0 bottom-0 h-72 w-64 rounded-[3.5rem] bg-gray-200/35 rotate-3" />
            </div>

            <div className="relative z-10">
              <h2
                className="text-4xl sm:text-5xl md:text-7xl py-10 font-bold tracking-tight"
                style={{ color: 'var(--brand-blue)' }}
              >
                {t.heading}
              </h2>
              <p className="mt-6 text-lg sm:text-xl md:text-xl pb-5 text-gray-700 leading-relaxed max-w-2xl">
                {t.bodyPlaceholder}
              </p>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center font-semibold text-lg sm:text-xl text-[color:var(--brand-blue)] hover:text-[color:var(--accent-blue)] transition-colors underline underline-offset-4"
                >
                  {t.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}