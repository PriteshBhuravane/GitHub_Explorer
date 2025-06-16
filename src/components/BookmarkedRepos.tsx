import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Eye, Calendar, BookmarkCheck, ExternalLink, Edit3, Save, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

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

interface BookmarkedReposProps {
  bookmarkedRepos: Repository[];
  onToggleBookmark: (repo: Repository) => void;
}

const BookmarkedRepos = ({ bookmarkedRepos, onToggleBookmark }: BookmarkedReposProps) => {
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [editingNote, setEditingNote] = useState<number | null>(null);

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

  const saveNote = (repoId: number, note: string) => {
    const updatedNotes = { ...notes, [repoId]: note };
    setNotes(updatedNotes);
    localStorage.setItem('githubNotes', JSON.stringify(updatedNotes));
    setEditingNote(null);
  };

  const loadNotes = () => {
    const savedNotes = localStorage.getItem('githubNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  useState(() => {
    loadNotes();
  });

  if (bookmarkedRepos.length === 0) {
    return (
      <div className="text-center py-12">
        <BookmarkCheck className="w-16 h-16 mx-auto text-slate-400 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No bookmarked repositories</h3>
        <p className="text-slate-400">Start exploring and bookmark repositories that interest you!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Bookmarked Repositories</h2>
        <p className="text-slate-400">Manage and take notes on your favorite projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookmarkedRepos.map((repo) => (
          <Card key={repo.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img 
                    src={repo.owner.avatar_url} 
                    alt={repo.owner.login}
                    className="w-10 h-10 rounded-full ring-2 ring-slate-600"
                  />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold text-white truncate">
                      {repo.name}
                    </CardTitle>
                    <p className="text-sm text-slate-400 truncate">
                      {repo.owner.login}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleBookmark(repo)}
                  className="text-yellow-400 hover:text-slate-400 transition-colors"
                >
                  <BookmarkCheck className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {repo.description || 'No description available.'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {formatNumber(repo.stargazers_count)}
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {formatNumber(repo.forks_count)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatNumber(repo.watchers_count)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {repo.language && (
                    <Badge variant="secondary" className={`${getLanguageColor(repo.language)} text-white text-xs`}>
                      {repo.language}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
                </div>
              </div>

              {/* Notes Section */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-300">Personal Notes</h4>
                  {editingNote !== repo.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNote(repo.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {editingNote === repo.id ? (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add your notes about this repository..."
                      defaultValue={notes[repo.id] || ''}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-20"
                      onChange={(e) => setNotes({ ...notes, [repo.id]: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveNote(repo.id, notes[repo.id] || '')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNote(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 min-h-12 p-2 bg-slate-700/30 rounded border border-slate-700">
                    {notes[repo.id] || 'No notes added yet. Click the edit icon to add your thoughts about this repository.'}
                  </p>
                )}
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookmarkedRepos;
