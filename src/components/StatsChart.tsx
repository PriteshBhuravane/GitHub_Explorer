import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Code, Star, Users } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Repository {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  watchers_count: number;
}

interface StatsChartProps {
  repositories: Repository[];
}

const StatsChart = ({ repositories }: StatsChartProps) => {
  const languageStats = repositories.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLanguages = Object.entries(languageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topReposByStars = repositories
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);

  const languageChartData = {
    labels: topLanguages.map(([language]) => language),
    datasets: [
      {
        data: topLanguages.map(([, count]) => count),
        backgroundColor: [
          '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B',
          '#EC4899', '#6366F1', '#84CC16', '#F97316', '#06B6D4'
        ],
        borderWidth: 0,
      }
    ]
  };

  const starsChartData = {
    labels: topReposByStars.map(repo => repo.name.length > 15 ? `${repo.name.substring(0, 15)}...` : repo.name),
    datasets: [
      {
        label: 'Stars',
        data: topReposByStars.map(repo => repo.stargazers_count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#CBD5E1'
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#CBD5E1'
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#CBD5E1'
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.1)'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#CBD5E1',
          padding: 20
        }
      }
    }
  };

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalWatchers = repositories.reduce((sum, repo) => sum + repo.watchers_count, 0);
  const totalLanguages = Object.keys(languageStats).length;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Stars</p>
                <p className="text-2xl font-bold text-yellow-400">{formatNumber(totalStars)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Forks</p>
                <p className="text-2xl font-bold text-blue-400">{formatNumber(totalForks)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Watchers</p>
                <p className="text-2xl font-bold text-green-400">{formatNumber(totalWatchers)}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Languages</p>
                <p className="text-2xl font-bold text-purple-400">{totalLanguages}</p>
              </div>
              <Code className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut data={languageChartData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Repositories by Stars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={starsChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsChart;
