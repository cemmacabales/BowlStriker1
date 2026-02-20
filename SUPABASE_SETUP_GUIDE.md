# 🚀 Supabase CMS Setup Guide for BowlStriker1

## Overview

Your BowlStriker1 project now has a complete Content Management System (CMS) powered by Supabase! This guide will walk you through setting up the database and creating your first admin user.

## 📋 Prerequisites

- Supabase account (free tier works fine)
- Project created at https://supabase.com
- API keys already configured in `.env` file

## 🔧 Step 1: Set Up Database Tables

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project: `pbudkmiebjspyhxkcxqh`

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Database Setup Script**
   - Copy the entire contents of `supabase-setup.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Cmd+Enter (Mac) / Ctrl+Enter (Windows)

This will create:
- ✅ `products` table - Store all bowling products
- ✅ `orders` table - Customer orders
- ✅ `order_items` table - Items in each order
- ✅ `user_profiles` table - User information and admin status
- ✅ Row Level Security (RLS) policies - Secure data access
- ✅ Automatic triggers - Auto-create profiles on signup

## 👤 Step 2: Create Your First Admin User

### Option A: Using Supabase Dashboard (Recommended)

1. **Enable Email Auth** (if not already enabled)
   - Go to Authentication → Providers
   - Ensure "Email" is enabled

2. **Create a User**
   - Go to Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter an email and password
   - Click "Create user"

3. **Make User an Admin**
   - Go to Table Editor → `user_profiles`
   - Find the row with your user's email
   - Edit the row and set `is_admin` to `true`
   - Click "Save"

### Option B: Using SQL

Run this SQL query (replace with your email):

```sql
-- First, create the auth user using Supabase dashboard
-- Then run this to make them admin:
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

## 🎯 Step 3: Test Your Setup

### Test User Authentication

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Visit the login page**
   - Go to http://localhost:5173/login
   - Log in with your admin credentials

3. **Check Profile Page**
   - Navigate to Profile (click your name in the navbar)
   - You should see an "Admin Dashboard" card with "Switch to Admin Mode" button

### Test Admin CMS

1. **Access Admin Panel**
   - From Profile page, click "Switch to Admin Mode"
   - Or navigate directly to http://localhost:5173/admin

2. **Add Your First Product**
   - Click "Products" in the sidebar
   - Click "Add Product"
   - Fill in the product details:
     - Name: e.g., "Storm IQ Tour Emerald"
     - Category: Select from dropdown
     - Price: e.g., 12999.00
     - Stock: e.g., 10
     - Image URL: Use a direct image link
     - Description: Detailed product info
   - Click "Create Product"

3. **View Product in Catalog**
   - Navigate to the Catalog page (http://localhost:5173/catalog)
   - Your new product should appear immediately!

## ✅ Features Overview

### For Admin Users:
- ✏️ **Create** new products
- 📝 **Edit** existing products
- 🗑️ **Delete** products
- 📊 **View** all orders
- 🔒 **Secure** access with RLS policies

### For Regular Users:
- 👀 **Browse** catalog (read-only)
- 🛒 **Add to cart** and checkout
- 📦 **View** their own orders
- 🚫 **Cannot** access admin features

### Real-time Features:
- 📡 Product changes sync automatically
- 🔄 No page refresh needed
- ⚡ Instant updates across all users

## 🔐 Security Features

1. **Row Level Security (RLS)**
   - Public users can only READ products
   - Only admins can CREATE, UPDATE, DELETE products
   - Users can only see their own orders

2. **Admin Protection**
   - Admin routes check `is_admin` status
   - Non-admin users redirected from admin pages
   - Profile page shows admin badge

3. **Data Validation**
   - Required fields enforced
   - Price and stock must be positive numbers
   - Email validation on signup

## 📊 Database Schema

### products
```
- id (UUID, primary key)
- name (text)
- description (text)
- price (decimal)
- image_url (text)
- category (text)
- stock (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### user_profiles
```
- id (UUID, references auth.users)
- email (text)
- is_admin (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### orders
```
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- status (text)
- total (decimal)
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- shipping_address (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### order_items
```
- id (UUID, primary key)
- order_id (UUID, references orders)
- product_id (UUID, references products)
- quantity (integer)
- price (decimal)
- created_at (timestamp)
```

## 🛠️ Useful Commands

### Generate TypeScript Types from Database
```bash
npx supabase gen types typescript --project-id=pbudkmiebjspyhxkcxqh > src/lib/supabase-types.ts
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🐛 Troubleshooting

### Problem: "Missing Supabase environment variables"
- **Solution**: Make sure `.env` file exists in the project root
- Check that variables are prefixed with `VITE_`

### Problem: "Cannot read products"
- **Solution**: Check RLS policies in Supabase dashboard
- Ensure the policy "Anyone can view products" exists

### Problem: "User is not admin"
- **Solution**: Update `user_profiles` table to set `is_admin = true`
- SQL: `UPDATE user_profiles SET is_admin = true WHERE email = 'your@email.com';`

### Problem: TypeScript errors
- **Solution**: Make sure `src/vite-env.d.ts` exists with environment type definitions
- Restart your IDE/TypeScript server

### Problem: Products not showing in catalog
- **Solution**: 
  1. Check browser console for errors
  2. Verify products exist in Supabase Table Editor
  3. Check RLS policies allow SELECT on products table

## 🎓 Next Steps

1. **Customize Product Categories**
   - Edit `src/admin/ProductEditor.tsx`
   - Update the category dropdown options

2. **Add More Admin Features**
   - Order management (update order status)
   - User management (view all users)
   - Analytics dashboard

3. **Enhance Security**
   - Add email verification requirement
   - Implement password reset
   - Add 2FA for admin accounts

4. **Improve UX**
   - Add image upload to Supabase Storage
   - Add bulk product import
   - Add product search and filters

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 🎉 You're All Set!

Your CMS is now fully operational. Happy managing! 🚀