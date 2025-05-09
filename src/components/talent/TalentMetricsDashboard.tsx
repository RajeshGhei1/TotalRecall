
import React from "react";
import TalentExperienceChart from "./TalentExperienceChart";
import TalentLocationChart from "./TalentLocationChart";
import TalentSalaryChart from "./TalentSalaryChart";
import TalentSkillsChart from "./TalentSkillsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchTalents } from "@/services/talentService";

const TalentMetricsDashboard = () => {
  const { data: talents } = useQuery({
    queryKey: ['talents'],
    queryFn: fetchTalents
  });

  const totalTalents = talents?.length || 0;
  const availableTalents = talents?.filter(t => t.availability_status === 'available').length || 0;
  const averageSalary = talents?.reduce((sum, t) => sum + (t.current_salary || 0), 0) / (talents?.length || 1);
  const averageExperience = talents?.reduce((sum, t) => sum + (t.years_of_experience || 0), 0) / (talents?.length || 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Talents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTalents}</div>
            <p className="text-xs text-muted-foreground">Registered talents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Talents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTalents}</div>
            <p className="text-xs text-muted-foreground">Ready for hire</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Current salary</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageExperience.toFixed(1)} years
            </div>
            <p className="text-xs text-muted-foreground">Professional experience</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TalentExperienceChart />
        <TalentLocationChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TalentSalaryChart />
        <TalentSkillsChart />
      </div>
    </div>
  );
};

export default TalentMetricsDashboard;
