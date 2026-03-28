import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Carteroo terms of service — rules and guidelines for using the platform.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: March 28, 2026</p>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Carteroo (&quot;the Site&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Site. Carteroo reserves the right to update these terms at any time. Continued use of the Site after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Use of the Platform</h2>
          <p>
            Carteroo is a marketplace connecting buyers and sellers of golf carts. We do not own, sell, or take possession of any vehicles listed on the platform. All transactions are directly between buyers and sellers.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You must be at least 18 years old to create an account or list a vehicle.</li>
            <li>You are responsible for the accuracy of any listing you create.</li>
            <li>You may not list items that are stolen, fraudulent, or misrepresented.</li>
            <li>Carteroo may remove any listing at its sole discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Payments & Fees</h2>
          <p>
            Carteroo offers optional paid features including Featured Listing Boosts and Dealer Subscriptions. Payments are processed securely by Stripe. All fees are non-refundable unless required by law. Subscriptions automatically renew until cancelled.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. No Warranty on Listings</h2>
          <p>
            Carteroo makes no representations or warranties about the condition, accuracy, or legality of any listed vehicle. Buyers should independently verify the condition and title of any vehicle before purchase. Carteroo is not liable for any transaction disputes between buyers and sellers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Prohibited Conduct</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Posting false, misleading, or duplicate listings</li>
            <li>Harassing or threatening other users</li>
            <li>Attempting to circumvent platform fees</li>
            <li>Scraping or automated access to the Site without permission</li>
            <li>Listing vehicles you do not have the right to sell</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Carteroo shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site or any transaction facilitated through it. Our total liability to you shall not exceed the amount you paid to Carteroo in the 30 days preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Account Termination</h2>
          <p>
            Carteroo reserves the right to suspend or terminate your account for violation of these terms, fraudulent activity, or any conduct we determine to be harmful to the platform or its users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Florida. Any disputes shall be resolved in the courts of Florida.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Contact</h2>
          <p>
            Questions about these terms? Email us at{" "}
            <a href="mailto:hello@carteroo.com" className="text-teal-700 hover:underline">
              hello@carteroo.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
