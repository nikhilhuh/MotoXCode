export interface Ride {
  id: string;
  title: string;
  location: {
    from: string;
    to: string;
  };
  date: string;
  distance: string;
  routeType: 'Inter-state' | 'Inter-city' | 'Intra-city';
  image: string;
  meetupTime: string;
  meetupLocation: string;
  membersJoined: number;
  description: string;
  duration: string;
  past?: boolean;
}

