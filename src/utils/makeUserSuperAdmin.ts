
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function makeUserSuperAdmin(email: string): Promise<boolean> {
  try {
    // First, fetch the user profile by email
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (profileError) {
      throw new Error(`User with email ${email} not found`);
    }

    // Update the user role to super_admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'super_admin' })
      .eq('id', profileData.id);

    if (updateError) {
      throw updateError;
    }

    toast({
      title: "Success",
      description: `User ${email} has been made a Super Admin.`,
    });

    return true;
  } catch (error: unknown) {
    console.error("Failed to make user super admin:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to make user super admin",
      variant: "destructive",
    });
    return false;
  }
}
