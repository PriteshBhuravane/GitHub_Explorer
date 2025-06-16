import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Eye, Calendar, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface RepositoryCardProps {
  repository: Repository;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const RepositoryCard = ({ repository, isBookmarked, onToggleBookmark }: RepositoryCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      Java: 'bg-orange-500',
      'C++': 'bg-pink-500',
      C: 'bg-gray-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-600',
      PHP: 'bg-purple-500',
      Ruby: 'bg-red-500',
      Swift: 'bg-orange-400',
      Kotlin: 'bg-purple-600',
    };
    return colors[language] || 'bg-gray-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img 
              src={repository.owner.avatar_url} 
              alt={repository.owner.login}
              className="w-10 h-10 rounded-full ring-2 ring-slate-600"
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-white truncate">
                {repository.name}
              </CardTitle>
              <p className="text-sm text-slate-400 truncate">
                {repository.owner.login}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBookmark}
            className="text-slate-400 hover:text-yellow-400 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-yellow-400" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
          {repository.description || 'No description available.'}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {formatNumber(repository.stargazers_count)}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            {formatNumber(repository.forks_count)}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {formatNumber(repository.watchers_count)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {repository.language && (
              <Badge variant="secondary" className={`${getLanguageColor(repository.language)} text-white text-xs`}>
                {repository.language}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(repository.updated_at), { addSuffix: true })}
          </div>
        </div>
        
        {repository.topics && repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repository.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs border-slate-600 text-slate-300">
                {topic}
              </Badge>
            ))}
            {repository.topics.length > 3 && (
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                +{repository.topics.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <Button 
          asChild 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          <a href={repository.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;
