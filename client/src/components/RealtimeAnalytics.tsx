import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, Eye, MousePointer, TrendingUp, Clock, Monitor, Smartphone, Tablet,
  Activity, BarChart3, LineChart, Download, RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RealtimeData {
  activeVisitors: number;
  recentEvents: any[];
  topPages: { postId: number; count: number; title: string }[];
  timestamp: Date;
}

interface RangeData {
  overview: {
    pageViews: number;
    uniqueVisitors: number;
    uniqueSessions: number;
    conversions: number;
    shares: number;
    conversionRate: string;
  };
  hourlyData: { hour: string; views: number; conversions: number }[];
  deviceBreakdown: { deviceType: string; count: number }[];
  dateRange: { start: string; end: string };
}

export function RealtimeAnalytics() {
  const [dateRange, setDateRange] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Get date range parameters
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        return { start: today.toISOString(), end: now.toISOString() };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday.toISOString(), end: today.toISOString() };
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: weekAgo.toISOString(), end: now.toISOString() };
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { start: monthAgo.toISOString(), end: now.toISOString() };
      default:
        return { start: today.toISOString(), end: now.toISOString() };
    }
  };

  // Fetch realtime data
  const { data: realtimeData, refetch: refetchRealtime } = useQuery<RealtimeData>({
    queryKey: ['realtime-analytics'],
    queryFn: () => apiRequest('/api/analytics/realtime'),
    refetchInterval: autoRefresh ? 30000 : false, // Refetch every 30 seconds if auto-refresh is on
  });

  // Fetch range data
  const { start, end } = getDateRange();
  const { data: rangeData, refetch: refetchRange } = useQuery<RangeData>({
    queryKey: ['analytics-range', start, end],
    queryFn: () => apiRequest(`/api/analytics/range?start=${start}&end=${end}`),
  });

  // Format event type for display
  const formatEventType = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      page_view: { label: 'Page View', color: 'bg-blue-500' },
      conversion: { label: 'Conversion', color: 'bg-green-500' },
      share: { label: 'Share', color: 'bg-purple-500' },
      click: { label: 'Click', color: 'bg-orange-500' },
      scroll: { label: 'Scroll', color: 'bg-gray-500' },
    };
    return types[type] || { label: type, color: 'bg-gray-400' };
  };

  // Format relative time
  const formatRelativeTime = (date: string) => {
    const now = Date.now();
    const then = new Date(date).getTime();
    const diff = now - then;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  // Prepare chart data
  const chartData = rangeData ? {
    labels: rangeData.hourlyData.map(d => {
      const date = new Date(d.hour);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    }),
    datasets: [
      {
        label: 'Page Views',
        data: rangeData.hourlyData.map(d => d.views),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Conversions',
        data: rangeData.hourlyData.map(d => d.conversions),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Device breakdown chart
  const deviceData = rangeData ? {
    labels: rangeData.deviceBreakdown.map(d => d.deviceType),
    datasets: [{
      label: 'Visitors by Device',
      data: rangeData.deviceBreakdown.map(d => d.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
    }],
  } : null;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Real-time Analytics</h2>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchRealtime();
              refetchRange();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="h-4 w-4 mr-2" />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Active Now</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {realtimeData?.activeVisitors || 0}
            </p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              <p className="text-xs text-gray-400">Live visitors</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {rangeData?.overview.pageViews || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {rangeData?.overview.uniqueVisitors || 0} unique visitors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Conversions</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {rangeData?.overview.conversions || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {rangeData?.overview.conversionRate || '0.00'}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Shares</CardTitle>
              <MousePointer className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {rangeData?.overview.shares || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">Social shares</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="activity">Live Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
        </TabsList>

        {/* Live Activity Feed */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Real-time visitor actions on your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {realtimeData?.recentEvents.map((event, index) => {
                  const eventInfo = formatEventType(event.eventType);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${eventInfo.color}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{eventInfo.label}</p>
                          <p className="text-xs text-gray-400">
                            {event.eventData?.title || event.url || 'Unknown page'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(event.createdAt)}
                      </span>
                    </div>
                  );
                })}
                {(!realtimeData?.recentEvents || realtimeData.recentEvents.length === 0) && (
                  <p className="text-center text-gray-400 py-8">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Chart */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Traffic Trends</CardTitle>
              <CardDescription className="text-gray-400">
                Page views and conversions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {chartData && <Line data={chartData} options={chartOptions} />}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Device Breakdown */}
        <TabsContent value="devices" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Device Breakdown</CardTitle>
              <CardDescription className="text-gray-400">
                Visitors by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  {deviceData && <Bar data={deviceData} options={{
                    ...chartOptions,
                    indexAxis: 'y' as const,
                  }} />}
                </div>
                <div className="space-y-4">
                  {rangeData?.deviceBreakdown.map((device, index) => {
                    const total = rangeData.deviceBreakdown.reduce((sum, d) => sum + d.count, 0);
                    const percentage = total > 0 ? (device.count / total * 100).toFixed(1) : '0';
                    const Icon = device.deviceType === 'mobile' ? Smartphone :
                                device.deviceType === 'tablet' ? Tablet : Monitor;
                    
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-white capitalize">
                              {device.deviceType}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {device.count} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={parseFloat(percentage)} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Pages */}
        <TabsContent value="pages" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Pages</CardTitle>
              <CardDescription className="text-gray-400">
                Most viewed content right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realtimeData?.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {page.title || `Post #${page.postId}`}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-400">
                          {page.count} active {page.count === 1 ? 'viewer' : 'viewers'}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{page.count}</Badge>
                  </div>
                ))}
                {(!realtimeData?.topPages || realtimeData.topPages.length === 0) && (
                  <p className="text-center text-gray-400 py-8">No active page views</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            // Export functionality would go here
            const data = {
              realtime: realtimeData,
              range: rangeData,
              exportedAt: new Date().toISOString(),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
}