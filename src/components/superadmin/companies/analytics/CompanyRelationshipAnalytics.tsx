
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';

interface CompanyRelationshipAnalyticsProps {
  companyId: string;
}

const CompanyRelationshipAnalytics: React.FC<CompanyRelationshipAnalyticsProps> = ({ companyId }) => {
  const { relationships } = useCompanyPeopleRelationship(companyId);
  
  // Group relationships by type
  const employmentCount = relationships?.filter(rel => rel.relationship_type === 'employment').length || 0;
  const businessContactCount = relationships?.filter(rel => rel.relationship_type === 'business_contact').length || 0;
  
  // Group relationships by current status
  const currentCount = relationships?.filter(rel => rel.is_current).length || 0;
  const pastCount = relationships?.filter(rel => !rel.is_current).length || 0;
  
  const relationshipTypeData = [
    { name: 'Employment', value: employmentCount },
    { name: 'Business Contact', value: businessContactCount },
  ].filter(item => item.value > 0);
  
  const relationshipStatusData = [
    { name: 'Current', value: currentCount },
    { name: 'Past', value: pastCount },
  ].filter(item => item.value > 0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  if (!relationships) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>People Relationships</CardTitle>
        </CardHeader>
        <CardContent className="h-52 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  if (relationships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>People Relationships</CardTitle>
        </CardHeader>
        <CardContent className="h-52 flex justify-center items-center text-muted-foreground">
          No relationship data available for this company
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>People Relationships</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-52">
            <p className="text-sm text-center mb-2 font-medium">Relationship Types</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={relationshipTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {relationshipTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-52">
            <p className="text-sm text-center mb-2 font-medium">Current vs Past</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={relationshipStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {relationshipStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-center text-muted-foreground">
          Total relationships: {relationships.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyRelationshipAnalytics;
