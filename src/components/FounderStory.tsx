import { Link } from 'react-router-dom';
import { en } from '../assets/lang/en';
import founderImage from '../assets/images/businessman.jpeg';
import { SECTION_HEADING, SECTION_SUBHEADING_LIGHT } from '../constants/sectionTypography';

const t = en.founderStory;

export default function FounderStory() {
  return (
    <section className="w-full bg-white relative lg:min-h-[100vh] lg:flex lg:items-center py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl w-full mx-auto px-5 md:px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">
          <div className="order-1 flex justify-start">
            <img
              src={founderImage}
              alt={t.imageAlt}
              className="w-full max-w-[220px] sm:max-w-[280px] lg:max-w-none rounded-2xl object-cover object-top aspect-[4/5] max-h-[280px] sm:max-h-[340px] lg:max-h-none lg:h-[min(72vh,680px)] lg:w-full lg:rounded-none lg:aspect-auto"
              decoding="async"
            />
          </div>

          <div className="order-2 mt-8 lg:mt-0">
            <h2
              className={`${SECTION_HEADING} py-4 lg:py-10 font-bold`}
              style={{ color: 'var(--brand-blue)' }}
            >
              {t.heading}
            </h2>
            <p className={`mt-4 lg:mt-6 ${SECTION_SUBHEADING_LIGHT} text-gray-700 max-w-2xl`}>
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
    </section>
  );
}
