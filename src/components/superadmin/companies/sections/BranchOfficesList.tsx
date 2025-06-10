
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { BranchOffice } from '@/hooks/useBranchOffices';

interface BranchOfficesListProps {
  branchOffices: BranchOffice[];
  onEdit: (branchOffice: BranchOffice) => void;
  onDelete: (id: string) => void;
}

export const BranchOfficesList: React.FC<BranchOfficesListProps> = ({
  branchOffices,
  onEdit,
  onDelete,
}) => {
  if (branchOffices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No branch offices added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {branchOffices.map((office) => (
        <Card key={office.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">{office.branch_name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">{office.branch_type}</Badge>
                    {office.is_headquarters && (
                      <Badge variant="default">Headquarters</Badge>
                    )}
                    {!office.is_active && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(office)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(office.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {office.gst_number && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">GST Number:</span>
                    <p className="text-sm font-mono">{office.gst_number}</p>
                  </div>
                )}
                
                {office.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{office.address}</p>
                      {(office.city || office.state || office.postal_code) && (
                        <p className="text-sm text-gray-500">
                          {[office.city, office.state, office.postal_code]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      {office.country && (
                        <p className="text-sm text-gray-500">{office.country}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {office.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{office.phone}</span>
                  </div>
                )}
                
                {office.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{office.email}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
