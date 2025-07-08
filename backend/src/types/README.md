# Types

This folder contains all TypeScript interfaces for API responses and other type definitions.

## Structure

- `auth.types.ts` - Authentication-related response types
- `onboarding.types.ts` - Onboarding-related response types
- `masterAdmin.types.ts` - Master admin-related response types
- `index.ts` - Exports all types

## Usage

### Response Types

All API responses should be properly typed:

```typescript
import { LoginResponse, LoginErrorResponse } from '../types';

router.post('/login', async (req: Request, res: Response<LoginResponse | LoginErrorResponse>) => {
  // ... logic
  res.json({ success: true, user: userObj });
});
```

### Service Types

Types can also be used in services for better type safety:

```typescript
import { OnboardingSuccessResponse } from '../types';

export class OnboardingService {
  static async handleOnboarding(data: OnboardingInput): Promise<OnboardingSuccessResponse> {
    // ... logic
  }
}
```

## Benefits

1. **Type Safety**: All responses are properly typed
2. **Consistency**: Standardized response format across all endpoints
3. **Documentation**: Types serve as API documentation
4. **Maintainability**: Centralized type definitions make changes easier
5. **IDE Support**: Better autocomplete and error detection

## Adding New Types

1. Create a new file in the types folder (e.g., `user.types.ts`)
2. Define TypeScript interfaces for response types
3. Export interfaces from the file
4. Add the export to `index.ts`
5. Update the corresponding route and service files to use the new types
