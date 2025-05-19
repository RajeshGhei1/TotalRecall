
import { supabase } from "@/integrations/supabase/client";

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  type: 'client' | 'prospect' | 'vendor' | 'partner';
  company_name?: string;
  position?: string;
  created_at: string;
}

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    // This is a mock implementation until real data is available
    // In a real implementation, we would query the 'people' table with type = 'contact'
    const mockContacts: Contact[] = [
      {
        id: "c1",
        full_name: "Alice Brown",
        email: "alice@example.com",
        phone: "555-123-4567",
        type: "client",
        company_name: "Acme Corp",
        position: "HR Manager",
        created_at: new Date().toISOString()
      },
      {
        id: "c2",
        full_name: "Bob Williams",
        email: "bob@example.com",
        phone: "555-234-5678",
        type: "prospect",
        company_name: "Globex",
        position: "CEO",
        created_at: new Date().toISOString()
      },
      {
        id: "c3",
        full_name: "Charlie Davis",
        email: "charlie@example.com",
        phone: "555-345-6789",
        type: "vendor",
        company_name: "Initech",
        position: "CTO",
        created_at: new Date().toISOString()
      }
    ];

    return mockContacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const fetchContactsByType = async (): Promise<{ name: string; value: number }[]> => {
  // Mock implementation for contact type distribution
  return [
    { name: "Client", value: 40 },
    { name: "Prospect", value: 30 },
    { name: "Vendor", value: 20 },
    { name: "Partner", value: 10 },
  ];
};

export const fetchContactsByLocation = async (): Promise<{ name: string; value: number }[]> => {
  // Mock implementation for contact location distribution
  return [
    { name: "New York", value: 35 },
    { name: "San Francisco", value: 28 },
    { name: "Chicago", value: 22 },
    { name: "Austin", value: 15 },
    { name: "Boston", value: 12 },
  ];
};

export const fetchContactsByCompany = async (): Promise<{ name: string; value: number }[]> => {
  // Mock implementation for contacts by company
  return [
    { name: "Acme Corp", value: 8 },
    { name: "Globex", value: 7 },
    { name: "Initech", value: 6 },
    { name: "Umbrella Corp", value: 5 },
    { name: "Stark Industries", value: 4 },
  ];
};

export const fetchContactEngagement = async (): Promise<{ month: string; emails: number; calls: number; meetings: number }[]> => {
  // Mock implementation for contact engagement metrics
  return [
    { month: "Jan", emails: 45, calls: 23, meetings: 12 },
    { month: "Feb", emails: 52, calls: 28, meetings: 15 },
    { month: "Mar", emails: 48, calls: 25, meetings: 18 },
    { month: "Apr", emails: 61, calls: 32, meetings: 21 },
    { month: "May", emails: 55, calls: 29, meetings: 17 },
    { month: "Jun", emails: 67, calls: 36, meetings: 24 },
  ];
};
