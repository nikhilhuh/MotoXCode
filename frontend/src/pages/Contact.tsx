import ContactHero from "../components/pages/contact/ContactHero";
import ContactForm from "../components/pages/contact/ContactForm";
import { ContactInfoItem } from "@/types/contactInfo";

// this static data will become dynamic and come from server
import ContactHeroBg from "/assets/images/contact/contactHero.png";
const contactInfo: ContactInfoItem[] = [
  {
    label: "Base",
    value: "Mumbai, Maharashtra, India",
    type: "base",
  },
  {
    label: "Email",
    value: "hello@motoxcode.in",
    type: "email",
  },
  {
    label: "Instagram",
    value: "@motoxcode.in",
    type: "instagram",
  },
  {
    label: "WhatsApp",
    value: "+91 9999999999",
    type: "whatsapp",
  },
  {
    label: "Phone",
    value: "+91 9999999999",
    type: "phone",
  },
  {
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
