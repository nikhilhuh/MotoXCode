import JoinHero from "../components/pages/join/JoinHero";
import JoinForm from "../components/pages/join/JoinForm";
import { GalleryImage } from "@/types/galleryImage";
import GalleryPreview from "@/components/ui/GalleryPreview";

// this static data will become dynamic and come from server
import JoinHeroBg from "/assets/images/join/joinHero.png";
const galleryPreviewImages: GalleryImage[] = [
  {
    id: "gallery1",
    src: "/assets/images/gallery/gallery1.jpg",
    title: "Mountain Pass Celebration",
    page: "join",
  },
  {
    id: "gallery2",
    src: "/assets/images/gallery/gallery2.jpg",
    title: "Coastal Convoy",
    page: "join",
  },
  {
    id: "gallery3",
    src: "/assets/images/gallery/gallery3.jpg",
    title: "Rain Reflections",
    page: "join",
  },
  {
    id: "gallery4",
    src: "/assets/images/gallery/gallery4.jpg",
    title: "Desert Run",
    page: "join",
  },
  {
    id: "gallery5",
    src: "/assets/images/gallery/gallery5.jpg",
    title: "Himalayan Scale",
    page: "join",
  },
  {
    id: "gallery6",
    src: "/assets/images/gallery/gallery6.jpg",
    title: "Golden Hour Viewpoint",
    page: "join",
  },
];

export default function Join() {
  return (
    <>
      <JoinHero JoinHeroBg={JoinHeroBg} />
      <JoinForm />
      <GalleryPreview
        galleryPreviewImages={galleryPreviewImages}
        className="bg-gradient-to-b from-[var(--color-surface)] to-black"
      />
    </>
  );
}
