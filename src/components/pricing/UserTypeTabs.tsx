
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Briefcase, User } from 'lucide-react';
import RecruitmentPlansTabs from './RecruitmentPlansTabs';
import EmployerPlansTabs from './EmployerPlansTabs';
import TalentPlansTabs from './TalentPlansTabs';

interface UserTypeTabsProps {
  currency: 'USD' | 'INR';
  formatPrice: (usdPrice: number) => string;
}

const UserTypeTabs: React.FC<UserTypeTabsProps> = ({ currency, formatPrice }) => {
  return (
    <Tabs defaultValue="recruitment" className="w-full max-w-5xl mx-auto">
      <div className="flex justify-center mb-10">
        <TabsList className="grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="recruitment" className="flex items-center gap-2 py-3 px-4">
            <Building className="h-4 w-4" />
            <div className="flex flex-col items-start text-left">
              <span className="font-medium">Recruitment Companies</span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">Full recruitment platform</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="employers" className="flex items-center gap-2 py-3 px-4">
            <Briefcase className="h-4 w-4" />
            <div className="flex flex-col items-start text-left">
              <span className="font-medium">Employers</span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">Job posting only</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="talent" className="flex items-center gap-2 py-3 px-4">
            <User className="h-4 w-4" />
            <div className="flex flex-col items-start text-left">
              <span className="font-medium">Talent</span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">For job seekers</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Recruitment Companies Plans */}
      <TabsContent value="recruitment">
        <RecruitmentPlansTabs currency={currency} formatPrice={formatPrice} />
      </TabsContent>
      
      {/* Employers Plans */}
      <TabsContent value="employers">
        <EmployerPlansTabs currency={currency} formatPrice={formatPrice} />
      </TabsContent>
      
      {/* Talent Plans */}
      <TabsContent value="talent">
        <TalentPlansTabs currency={currency} formatPrice={formatPrice} />
      </TabsContent>
    </Tabs>
  );
};

export default UserTypeTabs;
