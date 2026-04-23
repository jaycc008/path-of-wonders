import type { ReactNode } from 'react';

/** Light decorative layers on `bg-blue-100` — white/slate only, no extra hues. */
export type BlueBackdropVariant =
  | 'classic'
  | 'mist'
  | 'diagonal'
  | 'grid'
  | 'bloom'
  | 'sweep';

export function BlueSectionBackdrop({ variant }: { variant: BlueBackdropVariant }) {
  const shell = 'pointer-events-none absolute inset-0 overflow-hidden';

  switch (variant) {
    case 'classic':
      return (
        <div className={shell} aria-hidden>
          <div className="absolute -right-20 -top-20 h-[1220px] w-[860px] rotate-12 rounded-[9px] bg-white" />
        </div>
      );
    case 'mist':
      return (
        <div className={shell} aria-hidden>
          <div className="absolute -left-[22%] top-[-12%] h-[72vmin] w-[72vmin] rounded-full bg-white/[0.26] blur-[78px]" />
          <div className="absolute -bottom-[8%] -right-[18%] h-[58vmin] w-[58vmin] rounded-full bg-white/[0.16] blur-[68px]" />
        </div>
      );
    case 'diagonal':
      return (
        <div
          className={`${shell} opacity-[0.92]`}
          aria-hidden
          style={{
            background:
              'linear-gradient(122deg, rgb(255 255 255 / 0.38) 0%, rgb(255 255 255 / 0) 44%, rgb(255 255 255 / 0.06) 100%)',
          }}
        />
      );
    case 'grid':
      return (
        <div
          className={shell}
          aria-hidden
          style={{
            opacity: 0.45,
            backgroundImage: 'radial-gradient(rgb(148 163 184 / 0.11) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
      );
    case 'bloom':
      return (
        <div className={shell} aria-hidden>
          <div
            className="absolute left-[42%] top-[28%] h-[min(95vw,780px)] w-[min(95vw,780px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgb(255 255 255 / 0.34) 0%, rgb(255 255 255 / 0) 58%)',
            }}
          />
        </div>
      );
    case 'sweep':
      return (
        <div className={shell} aria-hidden>
          <div
            className="absolute -right-[24%] top-1/2 h-[125%] w-[58%] -translate-y-1/2 rounded-[46%]"
            style={{
              background:
                'linear-gradient(108deg, rgb(255 255 255 / 0.2) 0%, rgb(255 255 255 / 0.05) 48%, transparent 78%)',
            }}
          />
          <div className="absolute bottom-0 left-0 h-[35%] w-[45%] rounded-tr-[100%] bg-white/[0.07]" />
        </div>
      );
    default:
      return null;
  }
}

export default function BlueSection({
  children,
  className = '',
  backdrop = 'mist',
  ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  backdrop?: BlueBackdropVariant;
  ariaLabelledBy?: string;
}) {
  return (
    <section
      className={`relative w-full min-w-0 overflow-hidden bg-blue-100 ${className}`}
      {...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {})}
    >
      <BlueSectionBackdrop variant={backdrop} />
      <div className="relative z-10 w-full min-w-0">{children}</div>
    </section>
  );
}
