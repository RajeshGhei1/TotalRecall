
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Download
} from 'lucide-react';

interface EnrichmentRecord {
  id: string;
  contactName: string;
  contactEmail: string;
  status: 'success' | 'failed' | 'pending' | 'manual_review';
  enrichedAt: Date;
  matchConfidence?: number;
  linkedinProfileUrl?: string;
  errorMessage?: string;
}

const EnrichmentHistoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Mock data - in real implementation, this would come from API
  const enrichmentHistory: EnrichmentRecord[] = [
    {
      id: '1',
      contactName: 'John Smith',
      contactEmail: 'john.smith@example.com',
      status: 'success',
      enrichedAt: new Date('2024-01-15T10:30:00'),
      matchConfidence: 95,
      linkedinProfileUrl: 'https://linkedin.com/in/johnsmith'
    },
    {
      id: '2',
      contactName: 'Sarah Johnson',
      contactEmail: 'sarah.j@company.com',
      status: 'manual_review',
      enrichedAt: new Date('2024-01-15T09:15:00'),
      matchConfidence: 72
    },
    {
      id: '3',
      contactName: 'Mike Davis',
      contactEmail: 'mike.davis@email.com',
      status: 'failed',
      enrichedAt: new Date('2024-01-14T16:45:00'),
      errorMessage: 'No LinkedIn profile found matching email'
    },
    {
      id: '4',
      contactName: 'Lisa Chen',
      contactEmail: 'lisa.chen@tech.com',
      status: 'pending',
      enrichedAt: new Date('2024-01-14T14:20:00')
    }
  ];

  const getStatusIcon = (status: EnrichmentRecord['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'manual_review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: EnrichmentRecord['status']) => {
    const configs = {
      success: { label: 'Success', variant: 'default' as const, className: 'bg-green-600' },
      failed: { label: 'Failed', variant: 'destructive' as const, className: '' },
      manual_review: { label: 'Manual Review', variant: 'secondary' as const, className: 'bg-yellow-600 text-white' },
      pending: { label: 'Pending', variant: 'outline' as const, className: 'border-blue-600 text-blue-600' }
    };
    
    const config = configs[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const filteredHistory = enrichmentHistory.filter(record => {
    const matchesSearch = record.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportHistory = () => {
    console.log('Exporting enrichment history...');
    // Implementation for CSV export would go here
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Enrichment History
              </CardTitle>
              <CardDescription>
                View all LinkedIn profile enrichment activities and results
              </CardDescription>
            </div>
            <Button variant="outline" onClick={exportHistory}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="manual_review">Manual Review</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* History Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.contactName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.contactEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                        {record.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">
                            {record.errorMessage}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {record.matchConfidence ? (
                          <div className="flex items-center">
                            <div className="text-sm font-medium">
                              {record.matchConfidence}%
                            </div>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${record.matchConfidence}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.enrichedAt.toLocaleDateString()} {record.enrichedAt.toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {record.linkedinProfileUrl && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(record.linkedinProfileUrl, '_blank')}
                            >
                              View Profile
                            </Button>
                          )}
                          {record.status === 'manual_review' && (
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          )}
                          {record.status === 'failed' && (
                            <Button variant="outline" size="sm">
                              Retry
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No enrichment history found</p>
              <p className="text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start enriching contacts to see history here'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrichmentHistoryView;
