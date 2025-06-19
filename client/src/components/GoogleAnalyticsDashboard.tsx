import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Users, Eye, Clock, Globe, 
  Monitor, Smartphone, BarChart2, AlertCircle, ExternalLink 
} from 'lucide-react';

// Mock data for development - in production, this would come from Google Analytics API
const mockGAData = {
  overview: {
    users: 12847,
    newUsers: 8234,
    sessions: 15623,
    pageViews: 45892,
    avgSessionDuration: 156, // seconds
    bounceRate: 42.3,
    pageViewsPerSession: 2.94,
  },
  comparison: {
    users: { current: 12847, previous: 11234, change: 14.4 },
    sessions: { current: 15623, previous: 14892, change: 4.9 },
    pageViews: { current: 45892, previous: 42156, change: 8.9 },
    bounceRate: { current: 42.3, previous: 45.1, change: -6.2 },
  },
  topPages: [
    { page: '/', title: 'Home', views: 8234, avgTime: 45, bounceRate: 35.2 },
    { page: '/blog/ai-workflow-optimization-cut-your-processing-time-by-95', title: 'AI Workflow Optimization', views: 5123, avgTime: 234, bounceRate: 28.5 },
    { page: '/services/ai-powered-marketing', title: 'AI-Powered Marketing', views: 3892, avgTime: 156, bounceRate: 42.1 },
    { page: '/blog/understanding-ai-agents', title: 'Understanding AI Agents', views: 2341, avgTime: 189, bounceRate: 31.2 },
    { page: '/team', title: 'Team', views: 1823, avgTime: 78, bounceRate: 55.3 },
  ],
  trafficSources: [
    { source: 'Organic Search', users: 5234, percentage: 40.7 },
    { source: 'Direct', users: 3892, percentage: 30.3 },
    { source: 'Social', users: 2156, percentage: 16.8 },
    { source: 'Referral', users: 1023, percentage: 8.0 },
    { source: 'Email', users: 542, percentage: 4.2 },
  ],
  devices: {
    desktop: 58.3,
    mobile: 36.2,
    tablet: 5.5,
  },
  countries: [
    { country: 'United States', users: 7823, percentage: 60.9 },
    { country: 'Canada', users: 1523, percentage: 11.9 },
    { country: 'United Kingdom', users: 1023, percentage: 8.0 },
    { country: 'Australia', users: 892, percentage: 6.9 },
    { country: 'Germany', users: 586, percentage: 4.6 },
  ],
};

export function GoogleAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  // GA is now configured directly in index.html with ID: G-YJ9EKPZ80K
  const isConfigured = true;

  if (!isConfigured) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Google Analytics</CardTitle>
          <CardDescription className="text-gray-400">
            Connect Google Analytics to see comprehensive site metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-400 font-medium mb-2">Setup Required</h4>
                <p className="text-blue-300 text-sm mb-4">
                  To enable Google Analytics tracking:
                </p>
                <ol className="text-blue-300 text-sm space-y-2 mb-4">
                  <li>1. Create a Google Analytics 4 property</li>
                  <li>2. Get your Measurement ID (G-XXXXXXXXXX)</li>
                  <li>3. Add VITE_GA4_MEASUREMENT_ID to your .env file</li>
                  <li>4. Restart the development server</li>
                </ol>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://analytics.google.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to Google Analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getChangeColor = (change: number, inverse: boolean = false) => {
    if (inverse) {
      return change > 0 ? 'text-red-400' : 'text-green-400';
    }
    return change > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Google Analytics</h2>
          <p className="text-gray-400">Comprehensive site-wide analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://analytics.google.com', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View in GA
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockGAData.overview.users.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">
                    +{mockGAData.comparison.users.change}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Page Views</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockGAData.overview.pageViews.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">
                    +{mockGAData.comparison.pageViews.change}%
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Session Duration</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatDuration(mockGAData.overview.avgSessionDuration)}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {mockGAData.overview.pageViewsPerSession.toFixed(1)} pages/session
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bounce Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockGAData.overview.bounceRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="h-4 w-4 text-green-400" />
                  <span className={getChangeColor(mockGAData.comparison.bounceRate.change, true)}>
                    {mockGAData.comparison.bounceRate.change}%
                  </span>
                </div>
              </div>
              <BarChart2 className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Top Pages */}
        <TabsContent value="pages">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Pages</CardTitle>
              <CardDescription className="text-gray-400">
                Most visited pages on your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGAData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                    <div className="flex-1">
                      <p className="text-white font-medium">{page.title}</p>
                      <p className="text-gray-400 text-sm">{page.page}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-white">{page.views.toLocaleString()}</p>
                        <p className="text-gray-400">views</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{formatDuration(page.avgTime)}</p>
                        <p className="text-gray-400">avg. time</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{page.bounceRate}%</p>
                        <p className="text-gray-400">bounce</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources */}
        <TabsContent value="sources">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Traffic Sources</CardTitle>
              <CardDescription className="text-gray-400">
                Where your visitors come from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGAData.trafficSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{source.source}</span>
                      <span className="text-gray-400">{source.users.toLocaleString()} users</span>
                    </div>
                    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm">{source.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices */}
        <TabsContent value="devices">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Device Breakdown</CardTitle>
              <CardDescription className="text-gray-400">
                Devices used to access your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Monitor className="h-8 w-8 text-blue-400" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Desktop</span>
                      <span className="text-white">{mockGAData.devices.desktop}%</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${mockGAData.devices.desktop}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Smartphone className="h-8 w-8 text-green-400" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Mobile</span>
                      <span className="text-white">{mockGAData.devices.mobile}%</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400 rounded-full"
                        style={{ width: `${mockGAData.devices.mobile}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Monitor className="h-8 w-8 text-purple-400" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Tablet</span>
                      <span className="text-white">{mockGAData.devices.tablet}%</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-400 rounded-full"
                        style={{ width: `${mockGAData.devices.tablet}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations */}
        <TabsContent value="locations">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Countries</CardTitle>
              <CardDescription className="text-gray-400">
                Geographic distribution of visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGAData.countries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{country.users.toLocaleString()} users</span>
                      <Badge variant="secondary" className="bg-gray-700">
                        {country.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}