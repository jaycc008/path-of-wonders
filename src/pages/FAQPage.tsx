import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SKELETON_DURATION_MS = 500;

function FAQSkeleton() {
  return (
    <div
      className="animate-pulse space-y-4 h-full min-h-[480px] max-h-[480px] box-border pr-2"
      data-testid="faq-skeleton"
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

const FAQ_ITEMS = [
  {
    q: 'What is Path Of Wonders?',
    a: 'Path Of Wonders is an online learning platform that offers courses, books, and subscriptions to help you learn and grow. We focus on practical, high-quality content designed for the digital age.',
  },
  {
    q: 'How do I create an account?',
    a: 'Click “Sign up” or “Get started” on the site, enter your email and a password, and follow the steps. You can also sign in with an existing account if your organisation uses single sign-on.',
  },
  {
    q: 'How do I purchase a course or subscription?',
    a: 'Browse our courses or subscription options, choose what you want, and click to purchase. You’ll be guided through checkout. You need to be signed in to complete a purchase. Payment is handled securely via our payment provider.',
  },
  {
    q: 'How do I access my purchased courses or content?',
    a: 'After a successful purchase, you can access your content from your account or the link provided on the confirmation page. Make sure you’re logged in with the same account you used to buy.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Refund terms depend on the product and are described at checkout and in our Terms & Conditions. For specific refund requests, please contact us with your order details.',
  },
  {
    q: 'I forgot my password. What do I do?',
    a: 'Use the “Forgot password” or “Reset password” link on the login page. Enter the email associated with your account and follow the instructions sent to that email.',
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach us via the contact details on our website or in the footer. Include your name, email, and a short description of your issue so we can help you quickly.',
  },
];

export default function FAQPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), SKELETON_DURATION_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 min-h-[60vh] my-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        <div className="min-h-[480px] relative">
          {isLoading ? (
            <FAQSkeleton />
          ) : (
            <article className="space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.q}</h2>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
