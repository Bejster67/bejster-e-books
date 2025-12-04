import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ebook, PurchasedEbook, CreateEbookForm } from '@/types';
import { mockEbooks } from '@/lib/mockData';
import { useAuth } from './AuthContext';

interface EbookContextType {
  ebooks: Ebook[];
  myEbooks: Ebook[];
  purchasedEbooks: Ebook[];
  createEbook: (form: CreateEbookForm) => Promise<Ebook>;
  purchaseEbook: (ebookId: string) => Promise<boolean>;
  searchEbooks: (query: string) => Ebook[];
  getEbookById: (id: string) => Ebook | undefined;
}

const EbookContext = createContext<EbookContextType | undefined>(undefined);

export const EbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateBalance } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [myEbooks, setMyEbooks] = useState<Ebook[]>([]);
  const [purchasedEbooks, setPurchasedEbooks] = useState<Ebook[]>([]);

  useEffect(() => {
    const storedEbooks = localStorage.getItem('ebooks');
    if (storedEbooks) {
      setEbooks(JSON.parse(storedEbooks));
    } else {
      setEbooks(mockEbooks);
      localStorage.setItem('ebooks', JSON.stringify(mockEbooks));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const allEbooks = JSON.parse(localStorage.getItem('ebooks') || '[]');
      setMyEbooks(allEbooks.filter((e: Ebook) => e.authorId === user.id));

      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const userPurchases = purchases.filter((p: PurchasedEbook) => p.userId === user.id);
      const purchased = allEbooks.filter((e: Ebook) => 
        userPurchases.some((p: PurchasedEbook) => p.ebookId === e.id)
      );
      setPurchasedEbooks(purchased);
    }
  }, [user, ebooks]);

  const createEbook = async (form: CreateEbookForm): Promise<Ebook> => {
    if (!user) throw new Error('User not authenticated');

    const newEbook: Ebook = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      shortDescription: form.shortDescription,
      coverImage: `/assets/sample-ebook-cover-${Math.floor(Math.random() * 3) + 1}.jpg`,
      price: form.price,
      currency: form.currency,
      authorId: user.id,
      authorName: user.nickname,
      createdAt: new Date().toISOString(),
      downloads: 0,
      category: form.category,
      pdfUrl: `/ebooks/${form.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
    };

    const updatedEbooks = [...ebooks, newEbook];
    setEbooks(updatedEbooks);
    localStorage.setItem('ebooks', JSON.stringify(updatedEbooks));

    return newEbook;
  };

  const purchaseEbook = async (ebookId: string): Promise<boolean> => {
    if (!user) return false;

    const ebook = ebooks.find(e => e.id === ebookId);
    if (!ebook) return false;

    const purchase: PurchasedEbook = {
      ebookId,
      userId: user.id,
      purchaseDate: new Date().toISOString(),
      price: ebook.price,
      currency: ebook.currency
    };

    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    purchases.push(purchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));

    const updatedEbooks = ebooks.map(e => 
      e.id === ebookId ? { ...e, downloads: e.downloads + 1 } : e
    );
    setEbooks(updatedEbooks);
    localStorage.setItem('ebooks', JSON.stringify(updatedEbooks));

    const authorEbook = ebooks.find(e => e.id === ebookId);
    if (authorEbook) {
      const commission = ebook.price * 0.7;
      updateBalance(commission);
    }

    return true;
  };

  const searchEbooks = (query: string): Ebook[] => {
    if (!query) return ebooks;
    const lowerQuery = query.toLowerCase();
    return ebooks.filter(e => 
      e.title.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery) ||
      e.category.toLowerCase().includes(lowerQuery)
    );
  };

  const getEbookById = (id: string): Ebook | undefined => {
    return ebooks.find(e => e.id === id);
  };

  return (
    <EbookContext.Provider value={{
      ebooks,
      myEbooks,
      purchasedEbooks,
      createEbook,
      purchaseEbook,
      searchEbooks,
      getEbookById
    }}>
      {children}
    </EbookContext.Provider>
  );
};

export const useEbook = () => {
  const context = useContext(EbookContext);
  if (context === undefined) {
    throw new Error('useEbook must be used within an EbookProvider');
  }
  return context;
};