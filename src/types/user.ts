export type User = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  interests: string[];
};

export type UserRecord = User & {
  interestsLc: string[];
};




