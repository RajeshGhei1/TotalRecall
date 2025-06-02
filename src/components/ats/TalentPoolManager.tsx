
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  TrendingUp, 
  Award, 
  MapPin, 
  DollarSign,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTalents, fetchTalentsByExperience, fetchTalentsByLocation, fetchTalentsBySalary, fetchTalentsBySkill } from '@/services/talentService';
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import TalentList from '@/components/talent/TalentList';

interface TalentPoolManagerProps {
  searchTerm?: string;
}

const TalentPoolManager: React.FC<TalentPoolManagerProps> = ({ searchTerm = '' }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const { data: talents = [], isLoading } = useQuery({
    queryKey: ['talents-pool'],
    queryFn: fetchTalents
  });

  const { data: experienceData = [] } = useQuery({
    queryKey: ['talents-by-experience'],
    queryFn: fetchTalentsByExperience
  });

  const { data: locationData = [] } = useQuery({
    queryKey: ['talents-by-location'],
    queryFn: fetchTalentsByLocation
  });

  const { data: salaryData = [] } = useQuery({
    queryKey: ['talents-by-salary'],
    queryFn: fetchTalentsBySalary
  });

  const { data: skillsData = [] } = useQuery({
    queryKey: ['talents-by-skill'],
    queryFn: fetchTalentsBySkill
  });

  // Filter talents based on search and filters
  const filteredTalents = talents.filter(talent => {
    const matchesSearch = !searchTerm || 
      talent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExperience = experienceFilter === 'all' || 
      (experienceFilter === 'junior' && (talent.years_of_experience || 0) < 3) ||
      (experienceFilter === 'mid' && (talent.years_of_experience || 0) >= 3 && (talent.years_of_experience || 0) < 7) ||
      (experienceFilter === 'senior' && (talent.years_of_experience || 0) >= 7);
    
    const matchesLocation = locationFilter === 'all' || talent.location === locationFilter;
    
    return matchesSearch && matchesExperience && matchesLocation;
  });

  const uniqueLocations = [...new Set(talents.map(t => t.location).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Total Talent</p>
                <p className="text-2xl font-bold">{talents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">
                  {talents.filter(t => t.availability_status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Senior+</p>
                <p className="text-2xl font-bold">
                  {talents.filter(t => (t.years_of_experience || 0) >= 7).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Locations</p>
                <p className="text-2xl font-bold">{uniqueLocations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="junior">Junior (0-2 yrs)</SelectItem>
                  <SelectItem value="mid">Mid (3-6 yrs)</SelectItem>
                  <SelectItem value="senior">Senior (7+ yrs)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="dashboard">Analytics</TabsTrigger>
          <TabsTrigger value="talent-list">
            Talent Directory
            <Badge variant="secondary" className="ml-2">
              {filteredTalents.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TalentMetricsDashboard />
        </TabsContent>

        <TabsContent value="talent-list" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Talent Directory</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTalents.length} talents found
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">Loading talent pool...</div>
          ) : (
            <TalentList />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentPoolManager;
