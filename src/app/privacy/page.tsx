import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Carteroo privacy policy — how we collect, use, and protect your data.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: March 28, 2026</p>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>When you use Carteroo, we may collect:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Account information:</strong> name, email address, phone number, and location when you register.</li>
            <li><strong>Listing information:</strong> vehicle details, photos, and pricing you provide when creating a listing.</li>
            <li><strong>Payment information:</strong> processed securely by Stripe. Carteroo does not store your card details.</li>
            <li><strong>Usage data:</strong> pages visited, search queries, and interactions with listings.</li>
            <li><strong>Communications:</strong> messages sent through our inquiry forms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate and improve the Carteroo marketplace</li>
            <li>To connect buyers and sellers through inquiry emails</li>
            <li>To process payments for paid features</li>
            <li>To send transactional emails (inquiries, listing confirmations)</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
          <p className="mt-2">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Information Shared With Others</h2>
          <p>
            When you create a listing, your name, phone number, and email may be visible to buyers who send an inquiry. When you submit an inquiry, your contact details are shared with the seller. This is necessary for transactions to occur.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase</strong> — database and authentication</li>
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>Resend</strong> — transactional email delivery</li>
            <li><strong>Vercel</strong> — hosting and infrastructure</li>
          </ul>
          <p className="mt-2">Each of these services has its own privacy policy governing how they handle your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Cookies</h2>
          <p>
            Carteroo uses cookies and local storage to maintain your login session and save preferences such as favorite listings. We do not use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active. Listings are retained until you delete them or mark them as sold. You may request deletion of your account and associated data by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information in your profile</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of non-transactional communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Security</h2>
          <p>
            We use industry-standard security practices including encrypted connections (HTTPS), row-level security on our database, and secure authentication through Supabase. No system is 100% secure — please use a strong password and keep your credentials private.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Contact</h2>
          <p>
            Privacy questions or data requests? Email us at{" "}
            <a href="mailto:hello@carteroo.com" className="text-teal-700 hover:underline">
              hello@carteroo.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
