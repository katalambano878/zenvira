import PageHero from '@/components/PageHero';
import { PAGE_HEROES } from '@/lib/furniture-images';
import { getSiteName, getContactEmail } from '@/lib/site-defaults';

export default function PrivacyPage() {
  const siteName = getSiteName();
  const contactEmail = getContactEmail();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Privacy Policy"
        subtitle="Placeholder policy — replace before launch."
        backgroundImage={PAGE_HEROES.legal}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>
            This page is a starter placeholder for <strong>{siteName}</strong>. It is not legal advice.
            Replace this content with a privacy policy that matches your data practices and jurisdiction.
          </p>
          <p>
            Typical sections to add: information collected, how data is used, sharing with service providers,
            cookies, user rights, data retention, security, children&apos;s privacy, and contact details.
          </p>
          <p>
            Privacy inquiries:{' '}
            <a href={`mailto:${contactEmail}`} className="text-store-gold hover:underline">
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
