export type GalleryPageType = "home" | "rides" | "events" | "join";

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  page: GalleryPageType;
}
