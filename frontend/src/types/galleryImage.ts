export type GalleryPageType = "home" | "rides" | "events" | "join";

export interface GalleryImage {
  _id: string;
  src: string;
  title: string;
  page: GalleryPageType;
}
