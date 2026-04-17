import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import PrimaryButton from './PrimaryButton';

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="w-full py-16 sm:py-20 md:py-24 lg:h-screen lg:py-32 xl:py-40 flex items-center"
      style={{ backgroundColor: '#0F1B35' }}
    >
      <div className="max-w-7xl w-full mx-auto px-5 md:px-6 text-left">
        <h2
          id="final-cta-heading"
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white"
        >
          Raise a thinker. Not just a student.
        </h2>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-slate-200/90 leading-relaxed max-w-3xl">
          Path of Wonders is open for founding families.
        </p>

        <div className="mt-10 flex justify-start">
          <PrimaryButton size="lg" onClick={() => navigate(ROUTES.SIGNUP)}>
            Join Now
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
