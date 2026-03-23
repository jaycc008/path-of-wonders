import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * Last item should omit `to` for the current page (non-link).
 * First segment with label "Home" and `to: '/'` shows a home icon.
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-8 ${className}`.trim()}
    >
      {items.map((item, i) => (
        <Fragment key={`${item.label}-${i}`}>
          {i > 0 && (
            <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" aria-hidden />
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              {i === 0 && item.to === '/' && item.label === 'Home' && (
                <Home className="w-4 h-4 shrink-0" aria-hidden />
              )}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
