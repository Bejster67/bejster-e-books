import { Ebook } from '@/types';

export const mockEbooks: Ebook[] = [
  {
    id: '1',
    title: 'The Art of Digital Marketing',
    description: 'A comprehensive guide to mastering digital marketing strategies in the modern age. Learn SEO, social media marketing, content creation, and analytics to grow your business online.',
    shortDescription: 'Master digital marketing strategies including SEO, social media, and content creation for business growth.',
    coverImage: '/assets/sample-ebook-cover-2.jpg',
    price: 29.99,
    currency: 'USD',
    authorId: 'author1',
    authorName: 'Sarah Johnson',
    createdAt: '2024-01-15',
    downloads: 1250,
    category: 'Business',
    pdfUrl: '/ebooks/digital-marketing.pdf'
  },
  {
    id: '2',
    title: 'Journey to Self-Discovery',
    description: 'Transform your life with proven techniques for personal growth, mindfulness, and achieving your full potential. Includes practical exercises and real-life success stories.',
    shortDescription: 'Transform your life with proven techniques for personal growth, mindfulness, and achieving your potential.',
    coverImage: '/assets/sample-ebook-cover-3.jpg',
    price: 19.99,
    currency: 'USD',
    authorId: 'author2',
    authorName: 'Michael Chen',
    createdAt: '2024-02-20',
    downloads: 890,
    category: 'Self-Help',
    pdfUrl: '/ebooks/self-discovery.pdf'
  },
  {
    id: '3',
    title: 'Mystery at Midnight Manor',
    description: 'A thrilling mystery novel that will keep you on the edge of your seat. When detective Emma Stone arrives at the mysterious Midnight Manor, she uncovers secrets that change everything.',
    shortDescription: 'A thrilling mystery novel about detective Emma Stone uncovering dark secrets at Midnight Manor.',
    coverImage: '/assets/sample-ebook-cover-1.jpg',
    price: 14.99,
    currency: 'USD',
    authorId: 'author3',
    authorName: 'James Wilson',
    createdAt: '2024-03-10',
    downloads: 2100,
    category: 'Fiction',
    pdfUrl: '/ebooks/mystery-manor.pdf'
  }
];

export const aiModels = [
  { id: 'gpt4', name: 'GPT-4', description: 'Advanced language model for creative writing' },
  { id: 'claude', name: 'Claude', description: 'Excellent for long-form content' },
  { id: 'gemini', name: 'Gemini', description: 'Great for technical and educational content' }
];

export const coverStyles = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean and modern design' },
  { id: 'artistic', name: 'Artistic', description: 'Creative and colorful' },
  { id: 'professional', name: 'Professional', description: 'Business-oriented look' },
  { id: 'vintage', name: 'Vintage', description: 'Classic retro style' }
];

export const categories = [
  'Fiction',
  'Non-Fiction',
  'Business',
  'Self-Help',
  'Technology',
  'Science',
  'History',
  'Biography',
  'Romance',
  'Mystery'
];