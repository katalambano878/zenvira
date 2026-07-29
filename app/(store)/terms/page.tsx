import PageHero from '@/components/PageHero';
import { getSiteName, getContactEmail } from '@/lib/site-defaults';

export default function TermsPage() {
  const siteName = getSiteName();
  const contactEmail = getContactEmail();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Terms & Conditions"
        subtitle="Placeholder policy — replace before launch."
        backgroundImage="/logo.png"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>
            This page is a starter placeholder for <strong>{siteName}</strong>. It is not legal advice.
            Replace this content with terms reviewed by your counsel before accepting orders.
          </p>
          <p>
            Typical sections to add: use of the website, product and pricing terms, orders and payment,
            shipping and delivery, returns and refunds, intellectual property, limitation of liability,
            governing law, and contact information.
          </p>
          <p>
            Questions? Contact{' '}
            <a href={`mailto:${contactEmail}`} className="text-blue-700 hover:underline">
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
