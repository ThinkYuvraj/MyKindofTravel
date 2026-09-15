export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  region: string;
  tag?: string;
  priceNote: string;
  image: string;
  description: string;
  highlights: string[];
  bestTime: string;
  idealFor: string;
}

export interface ExperiencePillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  image: string;
  highlights: string[];
  typeKey: string;
}

export interface TravelPackage {
  id: string;
  tag: string;
  badge?: string;
  title: string;
  subtitle: string;
  duration: string;
  destination: string;
  startingPrice: string;
  image: string;
  features: string[];
  inclusions: string[];
  dayHighlights: {
    day: number;
    title: string;
    details: string;
  }[];
}

export interface TestimonialItem {
  id: string;
  rating: number;
  quote: string;
  initial: string;
  author: string;
  tripInfo: string;
  year: string;
}

export interface EnquiryForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  destination: string;
  tripType: string;
  travelDates: string;
  guestCount: string;
  message: string;
}
