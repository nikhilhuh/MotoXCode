import { useEffect, useState } from "react";
import JoinHero from "../components/pages/join/JoinHero";
import JoinForm from "../components/pages/join/JoinForm";
import GalleryPreview from "@/components/ui/GalleryPreview";
import { intakeService } from "@/services";
import { JoinSkeleton } from "../components/skeletons/JoinSkeleton";

type JoinPageData = Awaited<ReturnType<typeof intakeService.fetchJoinPageData>>;

export default function Join() {
  const [joinData, setJoinData] = useState<JoinPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const data = await intakeService.fetchJoinPageData();
        setJoinData(data);
      } catch (error) {
        console.error("Failed to load join data", error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  if (isLoading || !joinData) {
    return <JoinSkeleton />;
  }

  return (
    <>
      <JoinHero JoinHeroBg={joinData.hero.image} />
      <JoinForm />
      <GalleryPreview
        galleryPreviewImages={joinData.galleryPreview}
        className="bg-gradient-to-b from-[var(--color-surface)] to-black"
      />
    </>
  );
}
