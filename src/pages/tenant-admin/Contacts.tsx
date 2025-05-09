
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ContactRound } from "lucide-react";

const TenantAdminContacts = () => {
  const navigate = useNavigate();
  const params = useParams();
  const action = params.action;
  const id = params.id;

  // Render different content based on the action parameter
  const renderContent = () => {
    if (action === "add") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Add New Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Contact form will be implemented here.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/tenant-admin/contacts")}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      );
    } else if (action === "edit" && id) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Edit Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Editing contact with ID: {id}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/tenant-admin/contacts")}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      );
    } else if (action === "view" && id) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Viewing details for contact with ID: {id}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/tenant-admin/contacts")}
            >
              Back to Contacts
            </Button>
          </CardContent>
        </Card>
      );
    } else {
      // Default view - contact list
      return (
        <Card>
          <CardHeader>
            <CardTitle>Contact Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-12">
              <ContactRound className="h-16 w-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by adding your first contact
              </p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/tenant-admin/contacts/add")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contacts</h1>
          {!action && (
            <Button onClick={() => navigate("/tenant-admin/contacts/add")}>
              <Plus className="h-4 w-4 mr-2" /> Add Contact
            </Button>
          )}
        </div>
        
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default TenantAdminContacts;
