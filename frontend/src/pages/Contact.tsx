import { useEffect, useState } from "react";
import ContactHero from "../components/pages/contact/ContactHero";
import ContactForm from "../components/pages/contact/ContactForm";
import { intakeService } from "@/services";
import { ContactSkeleton } from "../components/skeletons/ContactSkeleton";

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

  if (isLoading || !contactData) {
    return <ContactSkeleton />;
  }

  return (
    <>
      <ContactHero ContactHeroBg={contactData.hero.image} />
      <ContactForm contactInfo={contactData.contactInfo} />
    </>
  );
}
