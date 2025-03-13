-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  subscription TEXT DEFAULT 'Free',
  usage_today INTEGER DEFAULT 0,
  sessions_today INTEGER DEFAULT 0,
  last_session_time TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  features JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  image_url TEXT NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content table for blog posts, services, etc.
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- 'blog', 'service', 'about', etc.
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft',
  author UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for API keys and other configuration
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscriptions (name, price, features) VALUES
('Free', 0, '{"image_limit": 15, "session_limit": 3, "features": ["Basic analysis results", "PDF & Excel exports", "Email support"]}'),
('Basic', 29, '{"image_limit": null, "session_limit": null, "features": ["Unlimited images", "Unlimited sessions", "Advanced analysis results", "PDF & Excel exports", "Priority email support", "30-day result history", "Batch processing up to 50 images"]}'),
('Professional', 99, '{"image_limit": null, "session_limit": null, "features": ["Everything in Basic", "Unlimited result history", "Batch processing up to 200 images", "API access", "Phone support", "Custom branding on exports", "Team access (up to 5 users)"]}'),
('Enterprise', 299, '{"image_limit": null, "session_limit": null, "features": ["Everything in Professional", "Dedicated account manager", "Custom integration support", "Unlimited team access", "Custom feature development"]}');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('imgbb_api_key', 'YOUR_IMGBB_API_KEY'),
('searchapi_key', 'YOUR_SEARCHAPI_KEY'),
('deepseek_api_key', 'YOUR_DEEPSEEK_API_KEY');