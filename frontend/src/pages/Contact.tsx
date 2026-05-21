import ContactHero from "../components/pages/contact/ContactHero";
import ContactForm from "../components/pages/contact/ContactForm";
import { ContactInfoItem } from "@/types/contactInfo";

// this static data will become dynamic and come from server
import ContactHeroBg from "/assets/images/contact/contactHero.png";
const contactInfo: ContactInfoItem[] = [
  {
    id: "contact1",
    label: "Base",
    value: "Mumbai, Maharashtra, India",
    type: "base",
  },
  {
    id: "contact2",
    label: "Email",
    value: "hello@motoxcode.in",
    type: "email",
  },
  {
    id: "contact3",
    label: "Instagram",
    value: "@motoxcode.in",
    type: "instagram",
  },
  {
    id: "contact4",
    label: "WhatsApp",
    value: "+91 9999999999",
    type: "whatsapp",
  },
  {
    id: "contact5",
    label: "Phone",
    value: "+91 9999999999",
    type: "phone",
  },
  {
    id: "contact6",
    label: "Website",
    value: "www.motoxcode.in",
    type: "website",
  },
];

export default function Contact() {
  return (
    <>
      <ContactHero ContactHeroBg={ContactHeroBg} />
      <ContactForm contactInfo={contactInfo} />
    </>
  );
}
