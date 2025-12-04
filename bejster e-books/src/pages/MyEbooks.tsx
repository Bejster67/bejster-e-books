import { useState } from 'react';
import { useEbook } from '@/contexts/EbookContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Ebook } from '@/types';

const MyEbooks = () => {
  const { myEbooks, purchasedEbooks } = useEbook();
  const [activeTab, setActiveTab] = useState('created');

  const handleDownload = (ebook: Ebook) => {
    toast.success(`Downloading ${ebook.title}...`);
  };

  const EbookCard = ({ ebook, showDownload = false }: { ebook: Ebook; showDownload?: boolean }) => (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={ebook.coverImage} 
          alt={ebook.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {showDownload && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              onClick={() => handleDownload(ebook)}
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{ebook.title}</h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{ebook.shortDescription}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ${ebook.price} {ebook.currency}
          </span>
          <Link to={`/ebook/${ebook.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
        {!showDownload && (
          <div className="mt-3 text-sm text-slate-500">
            {ebook.downloads} downloads
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              My E-books
            </h1>
            <p className="text-slate-600">Manage your created and purchased e-books</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="created">Created ({myEbooks.length})</TabsTrigger>
              <TabsTrigger value="purchased">Purchased ({purchasedEbooks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="mt-8">
              {myEbooks.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-slate-600 mb-4">You haven't created any e-books yet</p>
                  <Link to="/create-ebook">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Create Your First E-book
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEbooks.map((ebook) => (
                    <EbookCard key={ebook.id} ebook={ebook} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="purchased" className="mt-8">
              {purchasedEbooks.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-slate-600 mb-4">You haven't purchased any e-books yet</p>
                  <Link to="/marketplace">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Browse Marketplace
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedEbooks.map((ebook) => (
                    <EbookCard key={ebook.id} ebook={ebook} showDownload />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyEbooks;