-- Migration: Add name column to order_items and create stock decrement function
-- Run this in your Supabase SQL Editor

-- Add name and image_url columns to order_items for denormalized product info
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create function to decrement product stock (called after order placement)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION decrement_stock(UUID, INTEGER) TO authenticated;

-- Also add an admin policy so admins can view all user profiles (for order management)
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.is_admin = true
    )
  );