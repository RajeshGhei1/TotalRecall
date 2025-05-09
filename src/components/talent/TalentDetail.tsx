
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Talent } from "@/types/talent";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react";

interface TalentDetailProps {
  talentId: string;
}

const TalentDetail: React.FC<TalentDetailProps> = ({ talentId }) => {
  const navigate = useNavigate();

  // Fetch talent data
  const { data: talent, isLoading } = useQuery({
    queryKey: ['talent', talentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .eq('id', talentId)
        .single();
        
      if (error) throw error;
      return data as Talent;
    },
  });

  // Fetch custom field values for this talent
  const { data: customFieldValues = [] } = useQuery({
    queryKey: ['talentCustomFields', talentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_field_values')
        .select(`
          id, 
          value,
          field_id,
          custom_fields(id, name, field_key, field_type, description)
        `)
        .eq('entity_type', 'talent')
        .eq('entity_id', talentId);
        
      if (error) throw error;
      return data;
    },
    enabled: !!talentId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!talent) {
    return <div className="text-center py-10">Talent not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{talent.full_name}</h2>
        <Button onClick={() => navigate(`/tenant-admin/talent/edit/${talentId}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Talent
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="mt-1">{talent.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p className="mt-1">{talent.phone || "—"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p className="mt-1">{talent.location || "—"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
              <p className="mt-1">{talent.years_of_experience ? `${talent.years_of_experience} years` : "—"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Current Salary</h3>
              <p className="mt-1">
                {talent.current_salary ? `$${talent.current_salary.toLocaleString()}` : "—"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Desired Salary</h3>
              <p className="mt-1">
                {talent.desired_salary ? `$${talent.desired_salary.toLocaleString()}` : "—"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Availability</h3>
              <p className="mt-1">
                <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                  talent.availability_status === 'available' ? 'bg-green-100 text-green-800' :
                  talent.availability_status === 'hired' ? 'bg-blue-100 text-blue-800' :
                  talent.availability_status === 'not available' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {talent.availability_status || "Available"}
                </span>
              </p>
            </div>
          </div>
          
          {talent.bio && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground">Biography</h3>
              <p className="mt-1 whitespace-pre-wrap">{talent.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {customFieldValues.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {customFieldValues.map((fieldValue) => (
                <div key={fieldValue.id}>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {fieldValue.custom_fields?.name}
                  </h4>
                  <p className="mt-1">
                    {fieldValue.custom_fields?.field_type === 'boolean'
                      ? fieldValue.value ? "Yes" : "No"
                      : String(fieldValue.value || "—")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TalentDetail;
