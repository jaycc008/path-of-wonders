import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SKELETON_DURATION_MS = 500;

function CookiePolicySkeleton() {
  return (
    <div
      className="animate-pulse space-y-4 h-full min-h-[480px] max-h-[480px] box-border pr-2"
      data-testid="cookie-policy-skeleton"
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

export default function CookiePolicyPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), SKELETON_DURATION_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 min-h-[60vh] my-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <div className="min-h-[480px] relative">
          {isLoading ? (
            <CookiePolicySkeleton />
          ) : (
            <article className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                This Cookie Policy explains how Path Of Wonders (“we”, “our”, or “us”) uses cookies and similar technologies when you use our website and services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">What are cookies?</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cookies are small text files that are stored on your device (computer, tablet, or phone) when you visit a website. They are widely used to make websites work more efficiently and to give site owners useful information.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">How we use cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies only where necessary to provide and secure our services. Specifically:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li><strong>Authentication.</strong> We use cookies to keep you signed in after you log in. These cookies are essential so that you can move around the site and use features that require you to be logged in (such as accessing your courses or completing a purchase). Without these cookies, we would not be able to maintain your session.</li>
                <li>We do not use cookies for advertising, third-party tracking, or analytics on this site.</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Types of cookies we use</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The cookies we set are strictly necessary for authentication and security. They typically store a session or token so that our systems can recognise you as the same user as you move between pages. These are often called “session” or “authentication” cookies.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We do not use optional cookies (e.g. for preferences, marketing, or analytics) unless we clearly tell you and, where required by law, obtain your consent.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Managing cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                You can control or delete cookies through your browser settings. Please note that if you block or delete the cookies we use for authentication, you will not be able to stay logged in and may need to sign in again each time you visit or refresh the page. Some features of the site may not work correctly without these cookies.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Updates</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will post the updated policy on this page and, where appropriate, notify you via the site or email. The “last updated” date at the bottom of this page will be revised when we make changes.
              </p>

              <p className="text-gray-500 text-sm mt-8">
                Last updated: March 2026
              </p>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
