export interface Route {
  id: string;
  name: string;
  distance: string;
  terrain: string;
  difficulty: string;
  image: string;
  description?: string;
  startPoint?: string;
  endPoint?: string;
  highlights?: string[];
  bestSeason?: string;
}
