export type Product = {
  id: number;
  reference: string;
  name: string;
  description: string;
  mediaUrl: string;
  otherMediaUrl?: string[];
  otherMediaUrls?: string[];
  sizes: string[];
  price: number;
};
