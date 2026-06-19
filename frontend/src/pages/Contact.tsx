import { useEffect, useState, useCallback } from "react";
import ContactHero from "../components/pages/contact/ContactHero";
import ContactForm from "../components/pages/contact/ContactForm";
import { intakeService } from "@/services";
import { ContactSkeleton } from "../components/skeletons/ContactSkeleton";
import type { PageHero } from "@/services/cms.service";
import type { ContactInfoItem } from "@/types/contactInfo";

type ContactPageData = Awaited<ReturnType<typeof intakeService.fetchContactPageData>>;

export default function Contact() {
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await intakeService.fetchContactPageData();
        setContactData(data);
      } catch (error) {
        console.error("Failed to load contact data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleHeroUpdate = useCallback((updatedHero: PageHero) => {
    setContactData((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  }, []);

  const handleContactInfoUpdate = useCallback((updatedItems: ContactInfoItem[]) => {
    setContactData((prev) => (prev ? { ...prev, contactInfo: updatedItems } : prev));
  }, []);

  if (isLoading || !contactData) {
    return <ContactSkeleton />;
  }

  return (
    <>
      <ContactHero ContactHeroBg={contactData.hero.image} onUpdate={handleHeroUpdate} />
      <ContactForm
        contactInfo={contactData.contactInfo}
        onContactInfoUpdate={handleContactInfoUpdate}
      />
    </>
  );
}
