import { useEffect, useState, useCallback } from "react";
import ContactHero from "../components/pages/contact/ContactHero";
import ContactForm from "../components/pages/contact/ContactForm";
import { intakeService } from "@/services";
import { ContactSkeleton } from "../components/skeletons/ContactSkeleton";
import DataError from "../components/ui/DataError";
import type { PageHero } from "@/services/cms.service";
import type { ContactInfoItem } from "@/types/contactInfo";

type ContactPageData = Awaited<
  ReturnType<typeof intakeService.fetchContactPageData>
>;

export default function Contact() {
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function hydrate() {
      try {
        setError(false);
        const data = await intakeService.fetchContactPageData();
        setContactData(data);
      } catch (error) {
        console.error("Failed to load contact data", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleHeroUpdate = useCallback((updatedHero: PageHero) => {
    setContactData((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  }, []);

  const handleContactInfoUpdate = useCallback(
    (updatedItems: ContactInfoItem[]) => {
      setContactData((prev) =>
        prev ? { ...prev, contactInfo: updatedItems } : prev,
      );
    },
    [],
  );

  if (isLoading) {
    return <ContactSkeleton />;
  }

  if (error || !contactData) {
    return <DataError message="Failed to load contact data. Please try again later." onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <ContactHero
        ContactHeroBg={contactData.hero.image}
        onUpdate={handleHeroUpdate}
      />
      <ContactForm
        contactInfo={contactData.contactInfo}
        onContactInfoUpdate={handleContactInfoUpdate}
      />
    </>
  );
}
