import { ArrowRight } from 'lucide-react';

export type CourseCardModel = {
  title: string;
  description: string;
  tag?: string;
  featured?: boolean;
  image: string;
};

export default function CourseCard({
  course,
  onExplore,
}: {
  course: CourseCardModel;
  onExplore: () => void;
}) {
  return (
    <article className="relative rounded-lg overflow-hidden flex flex-col h-full bg-white  hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={course.image}
          alt=""
          className="block w-full object-cover h-64 sm:h-72"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />

        {course.featured && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
            Start Here
          </span>
        )}

        {course.tag ? (
          <span className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 inline-flex items-center rounded-full bg-white/90 text-gray-900 px-3 py-1 text-[11px] sm:text-xs font-semibold backdrop-blur">
            {course.tag}
          </span>
        ) : null}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-gray-900 tracking-tight text-2xl sm:text-3xl">
          {course.title}
        </h3>

        <p className="text-gray-600 leading-relaxed text-base  pt-2 pb-0">
          {course.description}
        </p>

        <div className="mt-auto flex flex-col items-start">
          <button
            type="button"
            onClick={onExplore}
            className={[
              'inline-flex items-center gap-2 text-lg sm:text-lg text-primary   py-2 font-semibold text-gray-900',
              'hover:text-gray-700 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
            ].join(' ')}
          >
            Explore
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

