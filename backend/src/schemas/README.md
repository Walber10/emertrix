# Schemas

This folder contains all Zod schemas for request validation.

## Structure

- `auth.schemas.ts` - Authentication-related request schemas
- `onboarding.schemas.ts` - Onboarding-related request schemas
- `masterAdmin.schemas.ts` - Master admin-related schemas (currently empty, GET endpoints only)
- `index.ts` - Exports all schemas

## Types

Response types and interfaces are now located in the `../types` folder.

## Usage

### Request Validation

All POST/PUT requests should use Zod schemas for validation:

```typescript
import { loginSchema, LoginRequest } from '../schemas';

router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.errors.map(e => e.message).join(', '),
    });
  }

  const { email, password } = result.data;
  // ... rest of the logic
});
```

### Response Types

All API responses should be properly typed:

```typescript
import { LoginResponse, LoginErrorResponse } from '../types';

router.post('/login', async (req: Request, res: Response<LoginResponse | LoginErrorResponse>) => {
  // ... logic
  res.json({ success: true, user: userObj });
});
```

## Benefits

1. **Type Safety**: All requests and responses are properly typed
2. **Validation**: Zod schemas provide runtime validation with detailed error messages
3. **Consistency**: Standardized response format across all endpoints
4. **Documentation**: Types serve as API documentation
5. **Maintainability**: Centralized schema definitions make changes easier

## Adding New Schemas

1. Create a new file in the schemas folder (e.g., `user.schemas.ts`)
2. Define Zod schemas for request validation
3. Export schemas from the file
4. Add the export to `index.ts`
5. Create corresponding types in the `../types` folder
6. Update the corresponding route file to use the new schemas and types
