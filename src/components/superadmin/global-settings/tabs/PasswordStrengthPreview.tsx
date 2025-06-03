
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { Eye, EyeOff, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasswordRequirements {
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
}

interface PasswordStrengthPreviewProps {
  requirements: PasswordRequirements;
}

export const PasswordStrengthPreview: React.FC<PasswordStrengthPreviewProps> = ({ requirements }) => {
  const [testPassword, setTestPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    let score = 0;

    // Check length
    if (password.length < requirements.password_min_length) {
      errors.push(`Must be at least ${requirements.password_min_length} characters`);
    } else {
      score += 1;
    }

    // Check uppercase
    if (requirements.password_require_uppercase && !/[A-Z]/.test(password)) {
      errors.push('Must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      score += 1;
    }

    // Check lowercase
    if (requirements.password_require_lowercase && !/[a-z]/.test(password)) {
      errors.push('Must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      score += 1;
    }

    // Check numbers
    if (requirements.password_require_numbers && !/\d/.test(password)) {
      errors.push('Must contain at least one number');
    } else if (/\d/.test(password)) {
      score += 1;
    }

    // Check symbols
    if (requirements.password_require_symbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Must contain at least one symbol (!@#$%^&*)');
    } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 4) {
      strength = 'strong';
    } else if (score >= 2) {
      strength = 'medium';
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  };

  const getRequirementsList = (): string[] => {
    const list = [`At least ${requirements.password_min_length} characters`];
    
    if (requirements.password_require_uppercase) {
      list.push('At least one uppercase letter (A-Z)');
    }
    if (requirements.password_require_lowercase) {
      list.push('At least one lowercase letter (a-z)');
    }
    if (requirements.password_require_numbers) {
      list.push('At least one number (0-9)');
    }
    if (requirements.password_require_symbols) {
      list.push('At least one symbol (!@#$%^&*)');
    }

    return list;
  };

  const passwordValidation = validatePassword(testPassword);

  const generateSamplePasswords = () => {
    const samples = [
      'password123',
      'Password123',
      'Password123!',
      'MySecureP@ssw0rd',
      'SimplePass',
      'Complex!P@ssw0rd123'
    ];
    return samples.slice(0, 3);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Password Strength Preview
        </CardTitle>
        <CardDescription>
          Test how passwords will be validated against your current policy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-password">Test Password</Label>
          <div className="relative">
            <Input
              id="test-password"
              type={showPassword ? "text" : "password"}
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Enter a password to test..."
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {testPassword && (
          <PasswordStrengthIndicator 
            password={testPassword}
            requirements={getRequirementsList()}
            validation={passwordValidation}
          />
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Test Samples</Label>
          <div className="grid gap-2">
            {generateSamplePasswords().map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setTestPassword(sample)}
                className="justify-start text-left h-auto p-2"
              >
                <span className="font-mono text-xs">{sample}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
