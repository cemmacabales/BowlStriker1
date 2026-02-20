# ⚡ Quick Start Guide

## 🚀 Get Running in 3 Steps

### 1️⃣ Set Up Database (One Time Only)

```bash
# 1. Go to: https://supabase.com/dashboard/project/pbudkmiebjspyhxkcxqh/sql/new
# 2. Copy all contents from supabase-setup.sql
# 3. Paste and click "Run"
```

### 2️⃣ Create Admin User

```bash
# 1. Go to: https://supabase.com/dashboard/project/pbudkmiebjspyhxkcxqh/auth/users
# 2. Click "Add user" → Create new user
# 3. Enter email & password
# 4. Go to Table Editor → user_profiles
# 5. Set is_admin = true for your user
```

### 3️⃣ Start Developing

```bash
npm run dev
```

## 📱 URLs

- **Homepage**: http://localhost:5173
- **Login**: http://localhost:5173/login
- **Profile**: http://localhost:5173/profile
- **Admin Panel**: http://localhost:5173/admin
- **Catalog**: http://localhost:5173/catalog

## 🎯 Workflow

1. **Login** with admin credentials
2. **Go to Profile** → Click "Switch to Admin Mode"
3. **Click Products** → Add Product
4. **Fill form** and save
5. **Check Catalog** → Your product appears!

## 🔑 First Admin User

After creating a user in Supabase dashboard, make them admin:

```sql
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

## ✅ Verification Checklist

- [ ] Database tables created (run supabase-setup.sql)
- [ ] Admin user created and marked as admin
- [ ] Can login at /login
- [ ] See admin badge on /profile
- [ ] Can access /admin
- [ ] Can create a product
- [ ] Product appears in /catalog

## 🆘 Having Issues?

See `SUPABASE_SETUP_GUIDE.md` for detailed troubleshooting.