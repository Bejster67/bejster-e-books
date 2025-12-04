import { useAuth } from '@/contexts/AuthContext';
import { useEbook } from '@/contexts/EbookContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const { myEbooks, purchasedEbooks, ebooks } = useEbook();

  const stats = [
    { 
      title: 'My E-books', 
      value: myEbooks.length, 
      icon: BookOpen, 
      color: 'from-blue-500 to-blue-600',
      link: '/my-ebooks'
    },
    { 
      title: 'Purchased', 
      value: purchasedEbooks.length, 
      icon: TrendingUp, 
      color: 'from-purple-500 to-purple-600',
      link: '/my-ebooks'
    },
    { 
      title: 'Balance', 
      value: `$${user?.balance.toFixed(2)}`, 
      icon: DollarSign, 
      color: 'from-green-500 to-green-600',
      link: '/withdraw'
    },
    { 
      title: 'Total E-books', 
      value: ebooks.length, 
      icon: Users, 
      color: 'from-orange-500 to-orange-600',
      link: '/marketplace'
    }
  ];

  const popularEbooks = ebooks.sort((a, b) => b.downloads - a.downloads).slice(0, 3);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Welcome back, {user?.nickname}!
            </h1>
            <p className="text-slate-600">Here's your publishing dashboard overview</p>
          </div>

          <div 
            className="relative h-64 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundImage: 'url(/assets/hero-banner-ebook-marketplace.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center">
              <div className="p-8 space-y-4 max-w-2xl">
                <h2 className="text-4xl font-bold text-white">Start Creating Today</h2>
                <p className="text-xl text-slate-200">
                  Use AI to write and publish your e-books. Reach thousands of readers worldwide.
                </p>
                <Link to="/create-ebook">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create E-book
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link key={index} to={stat.link}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl">Popular E-books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularEbooks.map((ebook) => (
                  <Link key={ebook.id} to={`/ebook/${ebook.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={ebook.coverImage} 
                          alt={ebook.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {ebook.downloads} downloads
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{ebook.title}</h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{ebook.shortDescription}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">
                            ${ebook.price}
                          </span>
                          <span className="text-sm text-slate-500">{ebook.category}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;