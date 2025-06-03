
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "./LoginForm";
import { usePasswordRequirements } from "@/hooks/usePasswordRequirements";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (data: SignupFormValues) => Promise<void>;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const { passwordSchema, validatePasswordStrength, getRequirementsList, isLoading: requirementsLoading } = usePasswordRequirements();
  const [currentPassword, setCurrentPassword] = useState('');

  // Create signup schema with dynamic password validation
  const signupSchema = z.object({
    email: loginSchema.shape.email,
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: passwordSchema,
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValidation = validatePasswordStrength(currentPassword);
  const requirementsList = getRequirementsList();

  if (requirementsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setCurrentPassword(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
              <PasswordStrengthIndicator 
                password={currentPassword}
                validation={passwordValidation}
                requirements={requirementsList}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={!passwordValidation.isValid && currentPassword.length > 0}
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
};
