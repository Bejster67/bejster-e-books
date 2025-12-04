export interface User {
  id: string;
  nickname: string;
  email: string;
  password: string;
  createdAt: string;
  balance: number;
  subscription: SubscriptionTier;
}

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface Subscription {
  tier: SubscriptionTier;
  price: number;
  ebooksLimit: number;
  startDate: string | null;
  endDate: string | null;
}

export interface Ebook {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  price: number;
  currency: 'USD' | 'EUR';
  authorId: string;
  authorName: string;
  createdAt: string;
  downloads: number;
  category: string;
  pdfUrl: string;
}

export interface PurchasedEbook {
  ebookId: string;
  userId: string;
  purchaseDate: string;
  price: number;
  currency: 'USD' | 'EUR';
}

export interface CreateEbookForm {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: 'USD' | 'EUR';
  aiModel: string;
  coverStyle: string;
  category: string;
}