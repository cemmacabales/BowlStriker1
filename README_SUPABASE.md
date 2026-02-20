# Supabase Integration Guide

## Setup Complete ✅

Your BowlStriker1 project is now configured to work with Supabase!

## What Was Configured

1. **Supabase Client** (`src/lib/supabase.ts`)
   - Configured with your project URL and publishable key
   - Ready to use throughout your application

2. **Environment Variables** (`.env`)
   - Stores your Supabase credentials securely
   - Added to `.gitignore` to prevent exposing sensitive data

3. **TypeScript Types** (`src/lib/supabase-types.ts`)
   - Baseline database types for products, orders, and order items
   - Can be regenerated from your actual database schema

## How to Use

### Import the Client

```typescript
import { supabase } from './lib/supabase';
```

### Example Usage

#### Fetch Products
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*');
```

#### Insert Order
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    user_id: 'user-id',
    status: 'pending',
    total: 99.99
  });
```

#### Authentication
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

#### Real-time Subscriptions
```typescript
const channel = supabase
  .channel('orders')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('Order changed:', payload);
    }
  )
  .subscribe();
```

## Next Steps

1. **Set Up Database Tables**: Create tables in your Supabase project dashboard
2. **Configure Row Level Security (RLS)**: Protect your data with proper policies
3. **Generate Types**: Run `npx supabase gen types typescript --project-id=jdzbrpylffaeyvxadkxd` to auto-generate types from your actual schema
4. **Update Contexts**: Modify `ProductContext`, `CartContext`, and `OrderContext` to use Supabase instead of local state

## Useful Supabase Commands

```bash
# Generate TypeScript types from your database
npx supabase gen types typescript --project-id=pbudkmiebjspyhxkcxqh > src/lib/supabase-types.ts

# Start development server
npm run dev
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)