import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Search, Star, GitFork, Eye, Calendar, Bookmark, BookmarkCheck, TrendingUp, Activity } from 'lucide-react';
import RepositoryCard from '@/components/RepositoryCard';
import StatsChart from '@/components/StatsChart';
import FilterPanel from '@/components/FilterPanel';
import BookmarkedRepos from '@/components/BookmarkedRepos';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  updated_at: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
}

const Index = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [bookmarkedRepos, setBookmarkedRepos] = useState<Repository[]>([]);
  const [activeTab, setActiveTab] = useState('explore');
  const { toast } = useToast();

  useEffect(() => {
    fetchTrendingRepos();
    loadBookmarkedRepos();
  }, []);

  useEffect(() => {
    filterAndSortRepos();
  }, [repositories, searchTerm, sortBy, languageFilter]);

  const fetchTrendingRepos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=30'
      );
      const data = await response.json();
      setRepositories(data.items || []);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch repositories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRepos = () => {
    let filtered = repositories;

    if (searchTerm) {
      filtered = filtered.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.owner.login.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (languageFilter !== 'all') {
      filtered = filtered.filter(repo => repo.language === languageFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredRepos(filtered);
  };

  const toggleBookmark = (repo: Repository) => {
    const isBookmarked = bookmarkedRepos.some(r => r.id === repo.id);
    let newBookmarked;
    
    if (isBookmarked) {
      newBookmarked = bookmarkedRepos.filter(r => r.id !== repo.id);
      toast({
        title: "Removed from bookmarks",
        description: `${repo.name} has been removed from your bookmarks.`,
      });
    } else {
      newBookmarked = [...bookmarkedRepos, repo];
      toast({
        title: "Added to bookmarks",
        description: `${repo.name} has been added to your bookmarks.`,
      });
    }
    
    setBookmarkedRepos(newBookmarked);
    localStorage.setItem('githubBookmarks', JSON.stringify(newBookmarked));
  };

  const loadBookmarkedRepos = () => {
    const saved = localStorage.getItem('githubBookmarks');
    if (saved) {
      setBookmarkedRepos(JSON.parse(saved));
    }
  };

  const getUniqueLanguages = () => {
    const languages = repositories
      .map(repo => repo.language)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return languages.sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            GitHub Explorer
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discover trending open source projects, analyze statistics, and build your collection of amazing repositories.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Bookmarks ({bookmarkedRepos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            <FilterPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              languageFilter={languageFilter}
              setLanguageFilter={setLanguageFilter}
              languages={getUniqueLanguages()}
              onRefresh={fetchTrendingRepos}
              loading={loading}
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-slate-700 rounded mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-slate-700 rounded w-16"></div>
                        <div className="h-6 bg-slate-700 rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepos.map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    repository={repo}
                    isBookmarked={bookmarkedRepos.some(r => r.id === repo.id)}
                    onToggleBookmark={() => toggleBookmark(repo)}
                  />
                ))}
              </div>
            )}

            {!loading && filteredRepos.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No repositories found</h3>
                <p className="text-slate-400">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <StatsChart repositories={repositories} />
          </TabsContent>

          <TabsContent value="bookmarks">
            <BookmarkedRepos
              bookmarkedRepos={bookmarkedRepos}
              onToggleBookmark={toggleBookmark}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
