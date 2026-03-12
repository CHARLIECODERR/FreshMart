-- Run this in your Supabase SQL Editor to set up the database schema

-- Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, 
  phone TEXT, 
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, 
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT, 
  description TEXT, 
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE, 
  parent_id UUID REFERENCES public.categories(id)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);


-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, 
  slug TEXT UNIQUE NOT NULL,
  description TEXT, 
  highlights TEXT[],
  category_id UUID REFERENCES public.categories(id),
  price NUMERIC(10,2) NOT NULL, 
  mrp NUMERIC(10,2),
  unit TEXT NOT NULL DEFAULT '1 pc',
  stock_qty INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE, 
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);


-- Product Images
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL, 
  display_order INT DEFAULT 0, 
  is_primary BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);


-- Cart Items (persistent)
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Addresses
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home', 
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL, 
  line1 TEXT NOT NULL, 
  line2 TEXT,
  city TEXT NOT NULL, 
  state TEXT NOT NULL, 
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE, 
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'placed' CHECK (status IN ('placed','confirmed','packed','out_for_delivery','delivered','cancelled')),
  address_snapshot JSONB NOT NULL,
  subtotal NUMERIC(10,2), 
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0, 
  total NUMERIC(10,2) NOT NULL,
  coupon_code TEXT, 
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  notes TEXT, 
  created_at TIMESTAMPTZ DEFAULT NOW(), 
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_snapshot JSONB NOT NULL,
  quantity INT NOT NULL, 
  unit_price NUMERIC(10,2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()
  )
);

-- Seed some dummy data
INSERT INTO public.categories (name, slug, description) VALUES 
('Vegetables', 'vegetables', 'Fresh daily vegetables'),
('Fruits', 'fruits', 'Fresh seasonal fruits'),
('Dairy & Bakery', 'dairy-bakery', 'Milk, bread, and eggs');

--------------------------------------------------------
-- ADMIN ROW LEVEL SECURITY (RLS) POLICIES
--------------------------------------------------------

-- 1. ADMIN FULL ACCESS (RBAC)
-- Only users with raw_user_meta_data->>'role' = 'admin' can insert/update/delete
CREATE POLICY "Admins full access to categories" ON public.categories FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
CREATE POLICY "Admins full access to products" ON public.products FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
CREATE POLICY "Admins full access to product_images" ON public.product_images FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
CREATE POLICY "Admins full access to orders" ON public.orders FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
CREATE POLICY "Admins full access to order_items" ON public.order_items FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
