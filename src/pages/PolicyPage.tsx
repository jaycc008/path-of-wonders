import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Breadcrumbs from '../components/Breadcrumbs';

const TERMLY_SCRIPT_ID = 'termly-jssdk';
const TERMLY_SCRIPT_SRC = 'https://app.termly.io/embed-policy.min.js';
const LOAD_TIMEOUT_MS = 10000;

/**
 * Injects the Termly embed script. Removes any existing script first so that
 * when navigating client-side (e.g. from Footer link), the script runs again
 * and finds the current [name="termly-embed"] div. Cache-bust so the script
 * is re-executed even if the browser had cached it.
 */
function loadTermlyScript(): void {
  const existing = document.getElementById(TERMLY_SCRIPT_ID);
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = TERMLY_SCRIPT_ID;
  script.src = `${TERMLY_SCRIPT_SRC}?t=${Date.now()}`;
  script.async = true;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

function PolicySkeleton() {
  return (
    <div
      className="animate-pulse space-y-4 h-full min-h-[480px] max-h-[480px] box-border pr-2"
      data-testid="policy-skeleton"
    >
      {[90, 100, 70, 85, 60, 95, 80, 70, 100, 95].map((width, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded flex-shrink-0"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}

interface PolicyPageProps {
  dataId: string;
  /** Shown in breadcrumbs as the current page */
  pageTitle: string;
}

const TERMLY_EMBED_NAME = 'termly-embed';

export default function PolicyPage({ dataId, pageTitle }: PolicyPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const embedEl = embedRef.current;
    if (!embedEl) return;

    // Set name via DOM so Termly's script can find this div. Not set in JSX to avoid TS/HTML div typings.
    embedEl.setAttribute('name', TERMLY_EMBED_NAME);

    const rafId = requestAnimationFrame(() => {
      loadTermlyScript();
    });

    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, LOAD_TIMEOUT_MS);

    const observer = new MutationObserver(() => {
      const hasContent = embedEl.childElementCount > 0 || (embedEl.textContent?.trim().length ?? 0) > 0;
      if (hasContent) {
        setIsLoading(false);
      }
    });

    observer.observe(embedEl, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [dataId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 min-h-[60vh]">
        <div className="mt-24">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: pageTitle }]} />
        </div>
        <div ref={containerRef} className="min-h-[480px] relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white overflow-hidden" aria-hidden="true">
              <PolicySkeleton />
            </div>
          )}
          <div
            ref={embedRef}
            key={dataId}
            data-id={dataId}
            className={isLoading ? 'invisible' : ''}
          />
        </div>
      </main>
      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}
