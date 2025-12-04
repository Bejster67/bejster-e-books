import { useState } from 'react';
import { useEbook } from '@/contexts/EbookContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const { ebooks, searchEbooks } = useEbook();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEbooks, setFilteredEbooks] = useState(ebooks);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredEbooks(searchEbooks(query));
  };

  const popularEbooks = [...ebooks].sort((a, b) => b.downloads - a.downloads);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              E-book Marketplace
            </h1>
            <p className="text-slate-600">Discover and purchase amazing e-books</p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search e-books by title, description, or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12 text-lg bg-white shadow-md"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-slate-900">
                {searchQuery ? 'Search Results' : 'Popular E-books'}
              </h2>
            </div>

            {filteredEbooks.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-600">No e-books found matching your search</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(searchQuery ? filteredEbooks : popularEbooks).map((ebook) => (
                  <Link key={ebook.id} to={`/ebook/${ebook.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group h-full">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={ebook.coverImage} 
                          alt={ebook.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {ebook.downloads} downloads
                        </div>
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {ebook.category}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{ebook.title}</h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{ebook.shortDescription}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-blue-600">
                              ${ebook.price}
                            </span>
                            <span className="text-sm text-slate-500 ml-1">{ebook.currency}</span>
                          </div>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            View
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          by {ebook.authorName}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;