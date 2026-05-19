export type GalleryPageType = "home" | "rides" | "events";

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  page: GalleryPageType;
}
