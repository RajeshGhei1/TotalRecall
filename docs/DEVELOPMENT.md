
# Total Recall - Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ with npm
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)

### Quick Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to `http://localhost:5173`

### Development Environment
```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## Project Structure

### Core Directories
```
src/
├── components/          # React components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── superadmin/     # SuperAdmin-specific components
│   ├── people/         # People management components
│   ├── forms/          # Dynamic forms system
│   └── auth/           # Authentication components
├── hooks/              # Custom React hooks
├── pages/              # Page components and routing
├── types/              # TypeScript type definitions
├── services/           # Business logic and API services
├── contexts/           # React context providers
├── lib/                # Utility libraries
└── integrations/       # External service integrations
```

### Component Organization
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Feature-based**: Components grouped by business domain
- **Shared Components**: Reusable UI components in `/ui` directory

## Architecture Principles

### Current Architecture
- **Frontend**: React 18 with TypeScript
- **State Management**: React Query (TanStack Query) for server state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with multi-tenant support

### Code Organization Principles

#### 1. Single Responsibility
Each component, hook, and service should have a single, well-defined purpose.

```typescript
// Good: Focused hook
export const usePeople = (filters?: PeopleFilters) => {
  // Only handles people data fetching and mutations
};

// Avoid: Mixed responsibilities
export const usePeopleAndCompaniesAndForms = () => {
  // Handles too many different concerns
};
```

#### 2. Composition over Inheritance
Prefer composing smaller components rather than creating large, monolithic ones.

```typescript
// Good: Composable components
const PersonCard = ({ person }: { person: Person }) => (
  <Card>
    <PersonHeader person={person} />
    <PersonDetails person={person} />
    <PersonActions person={person} />
  </Card>
);

// Avoid: Monolithic component
const PersonCardEverything = ({ person }: { person: Person }) => {
  // 500+ lines of mixed responsibilities
};
```

#### 3. Predictable State Management
Use React Query for server state and local state for UI-only concerns.

```typescript
// Server state with React Query
const { data: people, isLoading, error } = useQuery({
  queryKey: ['people', filters],
  queryFn: () => fetchPeople(filters),
});

// Local UI state
const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
```

## Development Workflows

### Feature Development

#### 1. Create Feature Branch
```bash
git checkout -b feature/ai-cognitive-assistance
```

#### 2. Component Development
Create focused, testable components:

```typescript
// src/components/ai/CognitiveAssistant.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCognitiveAssistance } from '@/hooks/ai/useCognitiveAssistance';

interface CognitiveAssistantProps {
  context: string;
  userId: string;
}

export const CognitiveAssistant: React.FC<CognitiveAssistantProps> = ({
  context,
  userId
}) => {
  const { suggestions, isLoading } = useCognitiveAssistance(context, userId);

  if (isLoading) return <div>Loading suggestions...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.map(suggestion => (
          <div key={suggestion.id}>{suggestion.text}</div>
        ))}
      </CardContent>
    </Card>
  );
};
```

#### 3. Hook Development
Create custom hooks for business logic:

```typescript
// src/hooks/ai/useCognitiveAssistance.ts
import { useQuery } from '@tanstack/react-query';
import { cognitiveAssistanceService } from '@/services/ai/cognitiveAssistanceService';

export const useCognitiveAssistance = (context: string, userId: string) => {
  return useQuery({
    queryKey: ['cognitive-assistance', context, userId],
    queryFn: () => cognitiveAssistanceService.getSuggestions(context, userId),
    enabled: !!context && !!userId,
  });
};
```

#### 4. Service Layer
Implement business logic in services:

```typescript
// src/services/ai/cognitiveAssistanceService.ts
import { supabase } from '@/integrations/supabase/client';

export const cognitiveAssistanceService = {
  async getSuggestions(context: string, userId: string) {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('user_id', userId)
      .eq('context', context)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },

  async provideFeedback(suggestionId: string, feedback: 'positive' | 'negative') {
    const { error } = await supabase
      .from('ai_feedback')
      .insert({
        suggestion_id: suggestionId,
        feedback,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }
};
```

### Database Development

#### Schema Changes
All database changes must be done through Supabase migrations:

```sql
-- migrations/20241201_add_ai_suggestions.sql
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  context TEXT NOT NULL,
  suggestion_text TEXT NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own suggestions"
  ON ai_suggestions FOR SELECT
  USING (auth.uid() = user_id);
```

#### Type Generation
Generate TypeScript types from database schema:

```typescript
// src/types/ai.ts
export interface AISuggestion {
  id: string;
  user_id: string;
  context: string;
  suggestion_text: string;
  confidence_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

## Code Standards

### TypeScript Guidelines

#### 1. Strict Type Safety
```typescript
// Good: Explicit types
interface UserData {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}

// Avoid: Any types
const userData: any = fetchUser();
```

#### 2. Union Types for State
```typescript
// Good: Explicit state modeling
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface DataState<T> {
  status: LoadingState;
  data?: T;
  error?: string;
}
```

#### 3. Generic Components
```typescript
// Good: Reusable generic components
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowSelect?: (row: T) => void;
}

export const DataTable = <T,>({ data, columns, onRowSelect }: DataTableProps<T>) => {
  // Implementation
};
```

### React Best Practices

#### 1. Component Props
```typescript
// Good: Explicit prop interfaces
interface PersonCardProps {
  person: Person;
  onEdit?: (person: Person) => void;
  isSelected?: boolean;
  className?: string;
}

// Use default parameters
export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onEdit,
  isSelected = false,
  className = ''
}) => {
  // Implementation
};
```

#### 2. Error Boundaries
```typescript
// Use ErrorBoundary for component error handling
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const PersonManagement = () => (
  <ErrorBoundary>
    <PersonList />
    <PersonDetails />
  </ErrorBoundary>
);
```

#### 3. Performance Optimization
```typescript
// Use React.memo for expensive components
export const PersonCard = React.memo<PersonCardProps>(({ person, onEdit }) => {
  // Implementation
});

// Use useMemo for expensive calculations
const sortedPeople = useMemo(() => 
  people.sort((a, b) => a.name.localeCompare(b.name)),
  [people]
);
```

### Styling Guidelines

#### 1. Tailwind CSS Classes
```typescript
// Good: Semantic class composition
const cardClasses = cn(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  isSelected && "ring-2 ring-primary",
  className
);

// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';
```

#### 2. Responsive Design
```typescript
// Always consider responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

## Testing Strategy

### Component Testing
```typescript
// src/components/people/PersonCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonCard } from './PersonCard';
import { mockPerson } from '@/test/mocks';

describe('PersonCard', () => {
  it('displays person information', () => {
    render(<PersonCard person={mockPerson} />);
    
    expect(screen.getByText(mockPerson.name)).toBeInTheDocument();
    expect(screen.getByText(mockPerson.email)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<PersonCard person={mockPerson} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockPerson);
  });
});
```

### Hook Testing
```typescript
// src/hooks/usePeople.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePeople } from './usePeople';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('usePeople', () => {
  it('fetches people data', async () => {
    const { result } = renderHook(() => usePeople(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.people).toBeDefined();
  });
});
```

## Performance Guidelines

### 1. Code Splitting
```typescript
// Lazy load pages
const PeoplePage = lazy(() => import('@/pages/People'));
const CompaniesPage = lazy(() => import('@/pages/Companies'));

// Use Suspense for loading states
<Suspense fallback={<div>Loading...</div>}>
  <PeoplePage />
</Suspense>
```

### 2. Query Optimization
```typescript
// Use proper query keys for caching
const { data: people } = useQuery({
  queryKey: ['people', { type, filters, page }],
  queryFn: () => fetchPeople({ type, filters, page }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 3. Bundle Size Management
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for duplicate dependencies
npx depcheck
```

## AI Development Guidelines

As Total Recall evolves to include AI features, follow these additional guidelines:

### 1. AI Component Structure
```typescript
// src/components/ai/
├── CognitiveAssistant.tsx    # Main AI interface
├── SuggestionCard.tsx        # Individual suggestion display
├── FeedbackDialog.tsx        # User feedback collection
└── AIInsights.tsx            # AI-generated insights
```

### 2. AI Hook Patterns
```typescript
// Standardized AI hook interface
export const useAIFeature = (context: AIContext) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ai-feature', context],
    queryFn: () => aiService.getFeatureData(context),
  });

  const provideFeedback = useMutation({
    mutationFn: aiService.provideFeedback,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['ai-feature', context]);
    }
  });

  return {
    data,
    isLoading,
    error,
    provideFeedback: provideFeedback.mutate
  };
};
```

### 3. AI Service Layer
```typescript
// src/services/ai/
├── orchestrationService.ts   # AI agent coordination
├── predictionService.ts      # Predictive modeling
├── insightsService.ts        # Data insights generation
└── learningService.ts        # User behavior learning
```

## Contributing Guidelines

### 1. Pull Request Process
1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Submit pull request with clear description
5. Address review feedback
6. Merge after approval

### 2. Code Review Checklist
- [ ] Code follows established patterns
- [ ] TypeScript types are properly defined
- [ ] Components are properly tested
- [ ] Performance implications considered
- [ ] Documentation updated
- [ ] No breaking changes without migration plan

### 3. Commit Message Format
```
feat: add cognitive assistance to people management

- Implement AI suggestion engine
- Add user feedback collection
- Update PersonCard with AI insights
- Add comprehensive tests

Closes #123
```

## Troubleshooting

### Common Issues

#### 1. Type Errors
```bash
# Run type checking
npm run type-check

# Common solutions:
# - Check import paths
# - Verify interface definitions
# - Update type definitions
```

#### 2. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for circular dependencies
npm run build -- --verbose
```

#### 3. Database Connection Issues
```bash
# Check Supabase configuration
# Verify environment variables
# Test database connection in Supabase dashboard
```

### Getting Help

1. Check existing documentation
2. Search codebase for similar implementations
3. Review error messages and stack traces
4. Ask team members for guidance
5. Create detailed issue reports

## Next Steps

1. Review the [Architecture Overview](./ARCHITECTURE.md)
2. Explore the [AI Roadmap](./AI_ROADMAP.md)
3. Check the [Module Specifications](./MODULE_SPECIFICATIONS.md)
4. Start contributing to Total Recall's evolution

## Conclusion

This development guide provides the foundation for building and enhancing Total Recall. As we progress through the AI implementation phases, these patterns and practices will ensure consistent, maintainable, and scalable code that supports the platform's transformation into a revolutionary cognitive assistance system.
