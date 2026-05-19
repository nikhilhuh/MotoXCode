export type EventType = "Ride" | "Meetup" | "Workshop" | "Social";

export interface Event {
  id: string;
  date: string;
  title: string;
  location: string;
  type: EventType;
  time: string;
  spots: number;
  spotsLeft: number;
}