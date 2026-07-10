export type EventType = "Ride" | "Meetup" | "Workshop" | "Social";

export interface Event {
  _id: string;
  date: string;
  title: string;
  location: string;
  type: EventType;
  time: string;
  spots: number;
  spotsLeft: number;
  description: string;
  image: string;
  past: boolean;
  isJoined?: boolean;
  attendees?: { username: string }[];
}