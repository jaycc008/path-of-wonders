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
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The Universe
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-1 leading-relaxed">
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

