import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { TrendingUp, TrendingDown, Users, Eye, Share2, Download, BarChart2, Activity } from 'lucide-react';
import { useState } from 'react';
import { RealtimeAnalytics } from './RealtimeAnalytics';

interface AnalyticsOverview {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLeads: number;
  totalShares: number;
  averageViews: number;
  conversionRate: string;
}

interface TopPost {
  id: number;
  title: string;
  slug: string;
  views: number;
  leads: number;
  shares: number;
  conversionRate: string;
  category: string;
  publishedAt: Date | null;
}

interface CategoryStats {
  category: string;
  posts: number;
  views: number;
  leads: number;
  shares: number;
  conversionRate: string;
  averageViews: number;
}

export function AnalyticsDashboard() {
  const [topPostsMetric, setTopPostsMetric] = useState<'views' | 'leads' | 'shares' | 'conversion'>('views');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('all');

  const { data: overview, isLoading: overviewLoading } = useQuery<AnalyticsOverview>({
    queryKey: ['analytics-overview'],
    queryFn: () => apiRequest('/api/cms/analytics/overview'),
  });

  const { data: topPosts = [], isLoading: topPostsLoading } = useQuery<TopPost[]>({
    queryKey: ['analytics-top-posts', topPostsMetric],
    queryFn: () => apiRequest(`/api/cms/analytics/top-posts?metric=${topPostsMetric}&limit=10`),
  });

  const { data: categoryStats = [], isLoading: categoryLoading } = useQuery<CategoryStats[]>({
    queryKey: ['analytics-by-category'],
    queryFn: () => apiRequest('/api/cms/analytics/by-category'),
  });

  const exportData = () => {
    // Create CSV data
    const csvData = [
      ['Post Analytics Report'],
      ['Generated on', new Date().toLocaleString()],
      [''],
      ['Overview'],
      ['Total Posts', overview?.totalPosts],
      ['Published Posts', overview?.publishedPosts],
      ['Total Views', overview?.totalViews],
      ['Total Leads', overview?.totalLeads],
      ['Conversion Rate', overview?.conversionRate + '%'],
      [''],
      ['Top Posts by ' + topPostsMetric],
      ['Title', 'Views', 'Leads', 'Shares', 'Conversion Rate'],
      ...topPosts.map(post => [
        post.title,
        post.views,
        post.leads,
        post.shares,
        post.conversionRate + '%'
      ]),
      [''],
      ['Category Performance'],
      ['Category', 'Posts', 'Views', 'Leads', 'Conversion Rate'],
      ...categoryStats.map(cat => [
        cat.category,
        cat.posts,
        cat.views,
        cat.leads,
        cat.conversionRate + '%'
      ])
    ];

    // Convert to CSV string
    const csv = csvData.map(row => row.join(',')).join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (overviewLoading) {
    return <div className="text-white">Loading analytics...</div>;
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <div className="flex justify-between items-center">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="realtime">
            <Activity className="h-4 w-4 mr-2" />
            Real-time
          </TabsTrigger>
        </TabsList>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{overview?.totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {overview?.averageViews} avg/post
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Leads</p>
                <p className="text-2xl font-bold text-white">{overview?.totalLeads.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-1">
                  {overview?.conversionRate}% conversion
                </p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Shares</p>
                <p className="text-2xl font-bold text-white">{overview?.totalShares.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Social engagement
                </p>
              </div>
              <Share2 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Published Posts</p>
                <p className="text-2xl font-bold text-white">{overview?.publishedPosts}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {overview?.draftPosts} drafts
                </p>
              </div>
              <BarChart2 className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Top Performing Posts</CardTitle>
              <CardDescription className="text-gray-400">
                Ranked by {topPostsMetric === 'conversion' ? 'conversion rate' : topPostsMetric}
              </CardDescription>
            </div>
            <Select value={topPostsMetric} onValueChange={(value: any) => setTopPostsMetric(value)}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="shares">Shares</SelectItem>
                <SelectItem value="conversion">Conversion Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {topPostsLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{post.title}</p>
                      <div className="flex gap-4 mt-1 text-sm text-gray-400">
                        <span>{post.views} views</span>
                        <span>{post.leads} leads</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-400">{post.conversionRate}%</p>
                    <p className="text-xs text-gray-500">conversion</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Category Performance</CardTitle>
          <CardDescription className="text-gray-400">
            Content performance breakdown by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categoryLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <div className="space-y-4">
              {categoryStats
                .sort((a, b) => b.views - a.views)
                .map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">{category.category}</p>
                      <p className="text-sm text-gray-400">{category.posts} posts</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Views</p>
                        <p className="text-white font-medium">{category.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Leads</p>
                        <p className="text-white font-medium">{category.leads.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conversion</p>
                        <p className="text-green-400 font-medium">{category.conversionRate}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((category.views / (categoryStats[0]?.views || 1)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      </TabsContent>

      {/* Real-time Tab */}
      <TabsContent value="realtime">
        <RealtimeAnalytics />
      </TabsContent>
    </Tabs>
  );
}