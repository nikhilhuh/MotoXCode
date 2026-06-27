import React, { useEffect } from "react";

const TermsOfService: React.FC = () => {
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
          Terms of Service
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed mb-12">
          Last Updated: June 2026
        </p>

        {/* 1. Acceptance of Terms */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          1. Acceptance of Terms
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            By accessing, browsing, registering for, or using our platform, you
            agree to be bound by these Terms of Service and all applicable laws
            and regulations. If you do not agree with these terms, you must
            discontinue use of the platform immediately.
          </p>
        </div>

        {/* 2. Eligibility */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          2. Eligibility
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            You must be at least 13 years old, or the minimum age required by
            the laws of your jurisdiction, to use our services.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            By creating an account, you represent and warrant that:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              The information you provide is accurate and up to date.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              You have the legal capacity to enter into these terms.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              You will comply with all applicable laws while using the platform.
            </li>
          </ul>
        </div>

        {/* 3. User Accounts */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          3. User Accounts
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Users are responsible for:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Maintaining the confidentiality of their account credentials.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              All activities conducted through their account.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Promptly notifying us of any unauthorized access or security
              concerns.
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate
            these Terms.
          </p>
        </div>

        {/* 4. Acceptable Use */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          4. Acceptable Use
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            You agree not to:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Violate any applicable law or regulation.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Harass, abuse, threaten, or harm other users.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Upload malicious software, viruses, or harmful code.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Attempt unauthorized access to accounts, systems, or networks.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Interfere with the operation, security, or integrity of the
              platform.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Impersonate another individual or organization.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Submit false, misleading, or fraudulent information.
            </li>
          </ul>
        </div>

        {/* 5. Community Standards */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          5. Community Standards
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            To maintain a safe and respectful environment, users must interact
            responsibly.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may investigate reports of misconduct and may take actions
            including:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Content removal
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Account warnings
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Temporary restrictions
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Permanent account suspension or termination
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Enforcement decisions are made at our reasonable discretion to
            protect the platform and its users.
          </p>
        </div>

        {/* 6. User Content */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          6. User Content
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            You retain ownership of content you submit to the platform.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            By submitting content, you grant us a non-exclusive, worldwide,
            royalty-free license to store, display, process, and distribute such
            content solely for the purpose of operating and improving the
            platform.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            You are solely responsible for the content you upload or publish.
          </p>
        </div>

        {/* 7. Intellectual Property */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          7. Intellectual Property
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            All platform features, branding, logos, designs, software, text,
            graphics, and related materials are protected by applicable
            intellectual property laws.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            You may not copy, reproduce, distribute, modify, reverse engineer,
            or exploit any part of the platform without prior written
            permission.
          </p>
        </div>

        {/* 8. Privacy */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          8. Privacy
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Our collection and use of personal information are governed by our
            Privacy Policy.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            By using the platform, you acknowledge that your information may be
            processed in accordance with that policy.
          </p>
        </div>

        {/* 9. Service Availability */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          9. Service Availability
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We strive to provide reliable services but do not guarantee
            uninterrupted availability.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Modify platform features
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Update functionality
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Perform maintenance
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Suspend services temporarily
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Discontinue features without prior notice
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            when reasonably necessary.
          </p>
        </div>

        {/* 10. Account Suspension and Termination */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          10. Account Suspension and Termination
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We reserve the right to suspend, restrict, or terminate access to
            the platform if:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              These Terms are violated.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Fraudulent activity is detected.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Security concerns arise.
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Required by law or regulatory authorities.
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Termination may occur without prior notice where necessary to
            protect users, the platform, or legal obligations.
          </p>
        </div>

        {/* 11. Disclaimer of Warranties */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          11. Disclaimer of Warranties
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            The platform is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            To the fullest extent permitted by law, we disclaim all warranties,
            whether express, implied, statutory, or otherwise, including
            warranties of merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>
        </div>

        {/* 12. Limitation of Liability */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          12. Limitation of Liability
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages arising from:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Use of the platform
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Inability to access the platform
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              User-generated content
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Unauthorized access to accounts
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Service interruptions
            </li>
          </ul>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Our total liability shall not exceed the amount paid by you, if any,
            for use of the service during the preceding twelve months.
          </p>
        </div>

        {/* 13. Indemnification */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          13. Indemnification
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            You agree to defend, indemnify, and hold harmless the platform, its
            owners, affiliates, employees, and partners from any claims,
            damages, liabilities, losses, and expenses arising from:
          </p>
          <ul className="pl-6 space-y-4" style={{ listStyleType: "disc" }}>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Your use of the platform
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Your content
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Your violation of these Terms
            </li>
            <li className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Your violation of any applicable law
            </li>
          </ul>
        </div>

        {/* 14. Changes to These Terms */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          14. Changes to These Terms
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We may update these Terms from time to time.
          </p>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Updated versions will be posted on this page with a revised
            &ldquo;Last Updated&rdquo; date. Continued use of the platform after
            changes become effective constitutes acceptance of the updated
            Terms.
          </p>
        </div>

        {/* 15. Governing Law */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          15. Governing Law
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            These Terms shall be governed and interpreted in accordance with the
            laws applicable in the jurisdiction in which the platform operator
            is established, without regard to conflict of law principles.
          </p>
        </div>

        {/* 16. Contact */}
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mt-12 mb-4 uppercase tracking-wide">
          16. Contact
        </h2>
        <div className="space-y-6">
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            For questions regarding these Terms, users may contact us through
            the official communication channels provided on the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
