
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Schema for super admin email validation
export const superAdminEmailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type SuperAdminEmailFormValues = z.infer<typeof superAdminEmailSchema>;

interface SuperAdminFormProps {
  onSubmit: (data: SuperAdminEmailFormValues) => Promise<void>;
  isPromoting: boolean;
  isPromoted: boolean;
}

export const SuperAdminForm: React.FC<SuperAdminFormProps> = ({ 
  onSubmit, 
  isPromoting, 
  isPromoted 
}) => {
  const form = useForm<SuperAdminEmailFormValues>({
    resolver: zodResolver(superAdminEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-sm">Admin Functions</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make Super Admin</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPromoting}>
              {isPromoting ? "Processing..." : "Promote to Super Admin"}
            </Button>
            {isPromoted && (
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  User successfully promoted to Super Admin.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
