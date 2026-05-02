export interface Ride {
  id: string;
  title: string;
  location: string;
  date: string;
  distance: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  description?: string;
  elevation?: string;
  duration?: string;
  past?: boolean;
}
