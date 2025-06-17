
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Plus,
  UserPlus
} from 'lucide-react';

interface TalentDatabaseProps {
  view?: 'search' | 'favorites' | 'recent' | 'analytics';
  showFilters?: boolean;
  allowAdd?: boolean;
}

const TalentDatabase: React.FC<TalentDatabaseProps> = ({
  view = 'search',
  showFilters = true,
  allowAdd = true
}) => {
  const [activeTab, setActiveTab] = useState(view);
  const [searchQuery, setSearchQuery] = useState('');

  const talents = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      experience: '8 years',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      education: 'BS Computer Science - Stanford',
      rating: 4.8,
      availability: 'Open to opportunities',
      lastContact: '2 weeks ago',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      experience: '6 years',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'UX'],
      education: 'MBA - Wharton',
      rating: 4.6,
      availability: 'Passive candidate',
      lastContact: '1 month ago',
      isFavorite: false
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'UX/UI Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      experience: '5 years',
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      education: 'BFA Design - Parsons',
      rating: 4.9,
      availability: 'Actively looking',
      lastContact: '1 week ago',
      isFavorite: true
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Seattle, WA',
      experience: '4 years',
      skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
      education: 'MS Data Science - CMU',
      rating: 4.7,
      availability: 'Open to opportunities',
      lastContact: '3 days ago',
      isFavorite: false
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Actively looking':
        return 'bg-green-100 text-green-800';
      case 'Open to opportunities':
        return 'bg-blue-100 text-blue-800';
      case 'Passive candidate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderTalentCard = (talent: any) => (
    <Card key={talent.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{talent.name}</h3>
              {talent.isFavorite && (
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-lg text-muted-foreground mb-1">{talent.title}</p>
            <p className="text-sm text-muted-foreground mb-3">
              {talent.company} • {talent.experience} experience
            </p>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(talent.rating)}
            <span className="ml-1 text-sm text-muted-foreground">
              {talent.rating}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{talent.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>{talent.education}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Badge className={getAvailabilityColor(talent.availability)}>
              {talent.availability}
            </Badge>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Key Skills</h4>
          <div className="flex flex-wrap gap-1">
            {talent.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>Last contact: {talent.lastContact}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            View Profile
          </Button>
          <Button size="sm" variant="outline">
            Contact
          </Button>
          <Button size="sm" variant="outline">
            {talent.isFavorite ? (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            ) : (
              <Star className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSearch = () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, location, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {showFilters && (
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        )}
        {allowAdd && (
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Talent
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {talents.map(renderTalentCard)}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Favorite Talents</h3>
        <span className="text-sm text-muted-foreground">
          {talents.filter(t => t.isFavorite).length} favorites
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {talents.filter(talent => talent.isFavorite).map(renderTalentCard)}
      </div>
    </div>
  );

  const renderRecent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recently Viewed</h3>
        <Button size="sm" variant="outline">
          Clear History
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {talents.slice(0, 2).map(renderTalentCard)}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Talent Database Analytics</h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Talents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actively Looking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.1</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Skills in Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['JavaScript', 'Python', 'React', 'AWS', 'Product Management'].map((skill, index) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-sm">{skill}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${85 - index * 10}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {85 - index * 10}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (view !== 'search') {
    switch (view) {
      case 'favorites':
        return renderFavorites();
      case 'recent':
        return renderRecent();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderSearch();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Talent Database</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Import Talents
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          {renderSearch()}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {renderFavorites()}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          {renderRecent()}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Module metadata for registration
(TalentDatabase as any).moduleMetadata = {
  id: 'talent-database',
  name: 'Talent Database',
  category: 'recruitment',
  version: '1.0.0',
  description: 'Comprehensive talent database with search, favorites, and analytics',
  author: 'System',
  requiredPermissions: ['read', 'write'],
  dependencies: ['ats-core'],
  props: {
    view: { type: 'string', options: ['search', 'favorites', 'recent', 'analytics'], default: 'search' },
    showFilters: { type: 'boolean', default: true },
    allowAdd: { type: 'boolean', default: true }
  }
};

export default TalentDatabase;
