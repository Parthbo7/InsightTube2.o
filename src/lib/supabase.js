import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing. Please add them to your .env file and restart the dev server.");
}

// Provide a valid fallback URL to prevent synchronous crash during module evaluation
// if the dev server hasn't picked up the .env file yet.
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-key';

// Export the singleton supabase client
export const supabase = createClient(safeUrl, safeKey);

// ==========================================
// Auth Service (Production)
// ==========================================

export const signupUser = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) throw error;
  return data.user;
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ==========================================
// Settings Service
// ==========================================

export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase.from('profiles').upsert({ id: userId, ...updates, updated_at: new Date() }).select().single();
  if (error) throw error;
  return data;
};

export const fetchUserPreferences = async (userId) => {
  const { data, error } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateUserPreferences = async (userId, updates) => {
  const { data, error } = await supabase.from('user_preferences').upsert({ user_id: userId, ...updates, updated_at: new Date() }, { onConflict: 'user_id' }).select().single();
  if (error) throw error;
  return data;
};

export const fetchSecuritySettings = async (userId) => {
  const { data, error } = await supabase.from('security_settings').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateSecuritySettings = async (userId, updates) => {
  const { data, error } = await supabase.from('security_settings').upsert({ user_id: userId, ...updates, updated_at: new Date() }, { onConflict: 'user_id' }).select().single();
  if (error) throw error;
  return data;
};

// ==========================================
// Channels Service
// ==========================================

export const getConnectedChannels = async (userId) => {
  const { data, error } = await supabase.from('connected_channels').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const connectChannel = async (userId, channelData) => {
  const { data, error } = await supabase.from('connected_channels').insert([{ user_id: userId, ...channelData }]).select().single();
  if (error) throw error;
  return data;
};

export const removeChannel = async (channelId) => {
  const { error } = await supabase.from('connected_channels').delete().eq('id', channelId);
  if (error) throw error;
};

// ==========================================
// Projects Service (Legacy/MVP support)
// ==========================================

export const getProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createProject = async (title, description) => {
  const { data, error } = await supabase.from('projects').insert([{ title, description }]).select();
  if (error) throw error;
  return data[0];
};

export const getAnalyses = async () => {
  const { data, error } = await supabase.from('youtube_analyses').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const saveAnalysis = async (video_url, transcript, summary) => {
  const { data, error } = await supabase.from('youtube_analyses').insert([{ video_url, transcript, summary }]).select();
  if (error) throw error;
  return data[0];
};
