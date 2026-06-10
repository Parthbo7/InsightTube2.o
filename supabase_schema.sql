-- Disable Row Level Security temporarily for MVP
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.users_temp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add password column if table already existed before the update
ALTER TABLE public.users_temp ADD COLUMN IF NOT EXISTS password TEXT;

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_temp(id) NULL,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.youtube_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_url TEXT,
    transcript TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Temporarily disable RLS for MVP
ALTER TABLE public.users_temp DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_analyses DISABLE ROW LEVEL SECURITY;

-- Create a dummy user for guest mode (Optional, but good for testing)
INSERT INTO public.users_temp (name, email) 
VALUES ('Guest User', 'guest@insighttube.local')
ON CONFLICT DO NOTHING;

-- ==================================================
-- PRODUCTION SCHEMA FOR AUTH & SETTINGS
-- ==================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    bio TEXT,
    website TEXT,
    country TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'dark',
    language TEXT DEFAULT 'English (US)',
    auto_save BOOLEAN DEFAULT true,
    notifications_reports BOOLEAN DEFAULT true,
    notifications_ai_alerts BOOLEAN DEFAULT true,
    notifications_security BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.connected_channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    channel_name TEXT,
    channel_url TEXT,
    platform TEXT,
    thumbnail TEXT,
    connected BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.security_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_password_change TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Create Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own connected channels" ON public.connected_channels;
CREATE POLICY "Users can view own connected channels" ON public.connected_channels FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own connected channels" ON public.connected_channels;
CREATE POLICY "Users can insert own connected channels" ON public.connected_channels FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own connected channels" ON public.connected_channels;
CREATE POLICY "Users can update own connected channels" ON public.connected_channels FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own connected channels" ON public.connected_channels;
CREATE POLICY "Users can delete own connected channels" ON public.connected_channels FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own security settings" ON public.security_settings;
CREATE POLICY "Users can view own security settings" ON public.security_settings FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own security settings" ON public.security_settings;
CREATE POLICY "Users can update own security settings" ON public.security_settings FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own security settings" ON public.security_settings;
CREATE POLICY "Users can insert own security settings" ON public.security_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a trigger to automatically create profile, preferences, and security rows on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  INSERT INTO public.security_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==================================================
-- YOUTUBE CHANNELS & ANALYTICS INTEGRATION
-- ==================================================

CREATE TABLE IF NOT EXISTS public.channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    channel_name TEXT,
    channel_id TEXT UNIQUE,
    youtube_handle TEXT,
    youtube_url TEXT,
    api_source TEXT DEFAULT 'youtube',
    thumbnail_url TEXT,
    banner_url TEXT,
    subscriber_count BIGINT DEFAULT 0,
    video_count BIGINT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure banner_url exists in public.channels
ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS banner_url TEXT;

CREATE TABLE IF NOT EXISTS public.channel_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    total_views BIGINT DEFAULT 0,
    total_watch_time BIGINT DEFAULT 0,
    total_subscribers BIGINT DEFAULT 0,
    total_videos BIGINT DEFAULT 0,
    engagement_rate NUMERIC DEFAULT 0,
    ctr NUMERIC DEFAULT 0,
    revenue_estimate NUMERIC DEFAULT 0,
    analytics_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    youtube_video_id TEXT UNIQUE,
    title TEXT,
    thumbnail TEXT,
    views BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    ctr NUMERIC DEFAULT 0,
    engagement_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    default_channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
    youtube_api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audience_demographics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    age_group TEXT,
    gender TEXT,
    percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all new tables
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_demographics ENABLE ROW LEVEL SECURITY;

-- Channels Policies
DROP POLICY IF EXISTS "Users can manage their own channels" ON public.channels;
CREATE POLICY "Users can manage their own channels" ON public.channels
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Channel Analytics Policies
DROP POLICY IF EXISTS "Users can view own channel analytics" ON public.channel_analytics;
CREATE POLICY "Users can view own channel analytics" ON public.channel_analytics
    FOR SELECT USING (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Users can manage own channel analytics" ON public.channel_analytics;
CREATE POLICY "Users can manage own channel analytics" ON public.channel_analytics
    FOR ALL USING (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    ) WITH CHECK (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    );

-- Videos Policies
DROP POLICY IF EXISTS "Users can view own channel videos" ON public.videos;
CREATE POLICY "Users can view own channel videos" ON public.videos
    FOR SELECT USING (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Users can manage own channel videos" ON public.videos;
CREATE POLICY "Users can manage own channel videos" ON public.videos
    FOR ALL USING (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    ) WITH CHECK (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    );

-- User Settings Policies
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;
CREATE POLICY "Users can manage their own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Audience Demographics Policies
DROP POLICY IF EXISTS "Users can view own channel demographics" ON public.audience_demographics;
CREATE POLICY "Users can view own channel demographics" ON public.audience_demographics
    FOR SELECT USING (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Users can manage own channel demographics" ON public.audience_demographics;
CREATE POLICY "Users can manage own channel demographics" ON public.audience_demographics
    FOR ALL USING (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    ) WITH CHECK (
        channel_id IN (SELECT id FROM public.channels WHERE user_id = auth.uid())
    );
