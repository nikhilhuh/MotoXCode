import React, { useEffect } from "react";

const PrivacyPolicy: React.FC = () => {
  useEffect((): void => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen pt-28 pb-20 px-4 md:px-8 bg-gradient-to-b from-[var(--color-bg)] to-black text-[var(--color-text-primary)] font-body">
      <div className="max-w-4xl mx-auto">
        <h1
          className="tracking-wider text-4xl md:text-5xl text-[var(--color-primary)] mb-2 uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed mb-12">
          Last Updated: June 2026
        </p>

        {/* 1. Introduction */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          1. Introduction
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            This Privacy Policy explains how we collect, use, store, and protect
            information when you access or use our platform.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            By using the platform, you acknowledge that your information may be
            processed as described in this Privacy Policy.
          </p>
        </div>

        {/* 2. Information We Collect */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          2. Information We Collect
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Depending on how you interact with the platform, we may collect the
            following categories of information:
          </p>

          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
            Account Information
          </h3>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            When you create an account, we may collect:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Name or username
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Email address
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Account credentials
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Profile information you choose to provide
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
            Authentication Information
          </h3>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            If you sign in using a third-party authentication provider, we may
            receive:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Basic profile information
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Email address
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Unique account identifier provided by the authentication service
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We do not receive or store your third-party account passwords.
          </p>

          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
            Content and Uploads
          </h3>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may collect information that you voluntarily submit, including:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Profile photos
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Cover images
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Messages or inquiries
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Application forms
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Community submissions
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Other content uploaded through the platform
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
            Technical Information
          </h3>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may automatically collect:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              IP address
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Browser type
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Device information
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Operating system
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Log data
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Usage analytics
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Date and time of platform interactions
            </li>
          </ul>
        </div>

        {/* 3. How We Use Your Information */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          3. How We Use Your Information
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may use collected information to:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Create and manage user accounts
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Authenticate users
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Operate and maintain the platform
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Process applications and inquiries
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Improve platform performance and user experience
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Detect fraud, abuse, or security threats
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Enforce our Terms of Service
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Respond to support requests
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Comply with legal obligations
            </li>
          </ul>
        </div>

        {/* 4. Cookies and Similar Technologies */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          4. Cookies and Similar Technologies
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may use cookies, local storage, session storage, and similar
            technologies to:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Maintain user sessions
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Remember preferences
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Improve functionality
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Analyze platform usage
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Enhance security
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            You may control cookies through your browser settings, although some
            features may not function properly if cookies are disabled.
          </p>
        </div>

        {/* 5. Sharing of Information */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          5. Sharing of Information
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We do not sell personal information.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may share information in the following circumstances:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              With service providers that help operate the platform
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              To comply with legal obligations
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              To protect rights, safety, and security
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              During a merger, acquisition, or business transfer
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              With your consent
            </li>
          </ul>
        </div>

        {/* 6. Data Retention */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          6. Data Retention
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We retain personal information only for as long as reasonably
            necessary to:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Provide our services
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Maintain user accounts
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Resolve disputes
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Enforce agreements
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Meet legal and regulatory obligations
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            When information is no longer required, we may delete, anonymize, or
            securely archive it.
          </p>
        </div>

        {/* 7. Data Security */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          7. Data Security
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We implement reasonable technical and organizational measures
            designed to protect personal information from unauthorized access,
            disclosure, alteration, or destruction.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            However, no method of transmission or storage can be guaranteed to
            be completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* 8. User Rights */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          8. User Rights
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Subject to applicable law, users may have the right to:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Access their personal information
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Correct inaccurate information
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Request deletion of personal information
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Restrict certain processing activities
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Withdraw consent where applicable
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Request a copy of their information
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Requests may be submitted through our official contact channels.
          </p>
        </div>

        {/* 9. Third-Party Services */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          9. Third-Party Services
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            The platform may integrate with third-party services, authentication
            providers, analytics providers, or external websites.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We are not responsible for the privacy practices of third-party
            services. Users should review the privacy policies of those
            providers separately.
          </p>
        </div>

        {/* 10. Children’s Privacy */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          10. Children&rsquo;s Privacy
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            The platform is not intended for children under the minimum age
            required by applicable law.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We do not knowingly collect personal information from children. If
            we become aware that such information has been collected, we will
            take reasonable steps to remove it.
          </p>
        </div>

        {/* 11. International Data Transfers */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          11. International Data Transfers
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Your information may be processed or stored in jurisdictions
            different from your country of residence.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            By using the platform, you acknowledge that such transfers may occur
            where permitted by law.
          </p>
        </div>

        {/* 12. Changes to This Privacy Policy */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          12. Changes to This Privacy Policy
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may update this Privacy Policy from time to time.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Any changes will be posted on this page along with an updated
            &ldquo;Last Updated&rdquo; date. Continued use of the platform after
            changes become effective constitutes acceptance of the revised
            Privacy Policy.
          </p>
        </div>

        {/* 13. Contact Us */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          13. Contact Us
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            If you have questions regarding this Privacy Policy or your personal
            information, please contact us through the official contact methods
            provided on the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
