import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const ChannelContext = createContext();

// Mock channel data for guest mode or when no channel is connected
const MOCK_CHANNEL = {
  id: 'mock-channel-id',
  channel_name: 'TechCraft AI',
  youtube_handle: '@techcraft_ai',
  youtube_url: 'https://youtube.com/@techcraft_ai',
  thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
  subscriber_count: 482901,
  video_count: 142,
  view_count: 12402910,
  updated_at: new Date().toISOString()
};

const MOCK_VIDEOS = [
  { id: 'v1', youtube_video_id: 'v1', title: '10 AI Trends You Can\'t Ignore in 2026', thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop', views: 450200, likes: 38200, comments: 2400, published_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), ctr: 12.4, engagement_rate: 9.02 },
  { id: 'v2', youtube_video_id: 'v2', title: 'The Future of Content Creation with LLMs', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=200&auto=format&fit=crop', views: 280100, likes: 21000, comments: 1800, published_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), ctr: 9.1, engagement_rate: 8.14 },
  { id: 'v3', youtube_video_id: 'v3', title: 'Building the Ultimate Desk Setup for Coding', thumbnail: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=200&auto=format&fit=crop', views: 1200000, likes: 110000, comments: 8900, published_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), ctr: 15.2, engagement_rate: 9.91 }
];

const MOCK_ANALYTICS = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const dateStr = date.toISOString().split('T')[0];
  const views = Math.floor(10000000 + i * 80000 + Math.random() * 20000);
  return {
    id: `ma-${i}`,
    analytics_date: dateStr,
    total_views: views,
    total_subscribers: Math.floor(450000 + i * 1100 + Math.random() * 200),
    total_watch_time: Math.floor(views * 0.08),
    total_videos: 135 + Math.floor(i / 10),
    engagement_rate: parseFloat((5.2 + Math.sin(i / 2) * 0.5).toFixed(2)),
    ctr: parseFloat((6.8 + Math.cos(i / 3) * 0.4).toFixed(2)),
    revenue_estimate: parseFloat((views * 0.0031).toFixed(2))
  };
});

export const ChannelProvider = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('Never synced');

  // Network Inspector Developer Panel state
  const [inspectorData, setInspectorData] = useState({
    endpoint: 'None',
    payload: 'None',
    statusCode: '-',
    responseTime: '-',
    errorMessage: '',
    stackTrace: '',
    lastSyncTime: 'Never',
    databaseStatus: 'Connected'
  });

  // Wrapper around fetch to measure request details
  const measureRequest = useCallback(async (url, options = {}) => {
    const start = performance.now();
    const requestName = `${options.method || 'GET'} ${url.split('?')[0]}`;
    const payloadStr = options.body ? options.body : 'None';
    try {
      const response = await fetch(url, options);
      const duration = Math.round(performance.now() - start);
      
      let errorMessage = '';
      let stackTrace = '';
      
      // Clone response to avoid consuming the stream
      const responseClone = response.clone();
      try {
        const errData = await responseClone.json();
        if (!response.ok) {
          errorMessage = errData.error || 'Unknown Error';
          stackTrace = errData.stack || '';
        }
      } catch (_) {
        try {
          errorMessage = await responseClone.text();
        } catch (_) {}
      }

      setInspectorData(prev => ({
        ...prev,
        endpoint: requestName,
        payload: payloadStr,
        statusCode: response.status,
        responseTime: `${duration}ms`,
        errorMessage: errorMessage,
        stackTrace: stackTrace,
        databaseStatus: response.ok ? 'Connected' : 'Error'
      }));
      return response;
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      setInspectorData(prev => ({
        ...prev,
        endpoint: requestName,
        payload: payloadStr,
        statusCode: 'Failed',
        responseTime: `${duration}ms`,
        errorMessage: err.message,
        stackTrace: err.stack || '',
        databaseStatus: 'Error'
      }));
      throw err;
    }
  }, []);

  // Helper to fetch authorization header
  const getAuthHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return {};
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  // Calculate human relative time for last synced
  const updateLastSyncedText = useCallback((updatedAtString) => {
    if (!updatedAtString) {
      setLastSyncedText('Never synced');
      return;
    }
    const diffMs = Date.now() - new Date(updatedAtString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) {
      setLastSyncedText('Just now');
    } else if (diffMins === 1) {
      setLastSyncedText('1 minute ago');
    } else if (diffMins < 60) {
      setLastSyncedText(`${diffMins} minutes ago`);
    } else {
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs === 1) {
        setLastSyncedText('1 hour ago');
      } else {
        setLastSyncedText(`${diffHrs} hours ago`);
      }
    }
  }, []);

  // Fetch videos and analytics for the current active channel
  const fetchChannelData = useCallback(async (channelUuid) => {
    if (!channelUuid) return;
    try {
      const headers = await getAuthHeaders();
      
      const [vRes, aRes] = await Promise.all([
        measureRequest(`/api/youtube/videos?channelId=${channelUuid}`, { headers }),
        measureRequest(`/api/youtube/analytics?channelId=${channelUuid}`, { headers })
      ]);

      if (vRes.ok && aRes.ok) {
        const vData = await vRes.json();
        const aData = await aRes.json();
        setVideos(vData.videos || []);
        setAnalytics(aData.analytics || []);
      }
    } catch (err) {
      console.error('Error fetching channel detail data:', err);
    }
  }, [getAuthHeaders, measureRequest]);

  // Load channels lists
  const loadChannels = useCallback(async (selectedId = null) => {
    const isPublicPage = location.pathname === '/' || 
                         location.pathname === '/features' || 
                         location.pathname === '/pricing' || 
                         location.pathname === '/login' || 
                         location.pathname === '/signup';

    if (!user || isPublicPage) {
      // Guest mode fallback or public page - DO NOT query channels table, DO NOT show database errors, DO NOT show toasts
      setChannels([MOCK_CHANNEL]);
      setActiveChannel(MOCK_CHANNEL);
      setVideos(MOCK_VIDEOS);
      setAnalytics(MOCK_ANALYTICS);
      setLastSyncedText('Just now');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();
      
      const queryParam = selectedId ? `?channelId=${selectedId}` : '';
      const response = await measureRequest(`/api/youtube/channel${queryParam}`, { headers });
      
      if (!response.ok) {
        let errText = 'API endpoint returned 500';
        let errStack = '';
        try {
          const errData = await response.json();
          errText = errData.error || errText;
          errStack = errData.stack || '';
        } catch (_) {}
        const errorObj = new Error(errText);
        errorObj.stack = errStack;
        throw errorObj;
      }

      const data = await response.json();
      setChannels(data.channels || []);
      
      if (data.channel) {
        setActiveChannel(data.channel);
        updateLastSyncedText(data.channel.updated_at);
        await fetchChannelData(data.channel.id);
      } else {
        setActiveChannel(null);
        setVideos([]);
        setAnalytics([]);
        setLastSyncedText('Never synced');
      }
    } catch (err) {
      console.error('Error loading channels:', err);
      // Suppress showing toast errors on landing pages
      if (!isPublicPage) {
        const showDetailed = import.meta.env.DEV;
        const msg = showDetailed ? err.message : 'Internal server error';
        
        // Deduplicate toasts to prevent spam
        toast.error(msg, { id: 'load-channels-error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, location.pathname, getAuthHeaders, fetchChannelData, updateLastSyncedText, measureRequest]);

  // Handle active channel change
  const changeActiveChannel = async (channelId) => {
    if (!user) return; // Guest mode cannot change active channel
    setIsLoading(true);
    await loadChannels(channelId);
  };

  // Trigger channel synchronization
  const syncChannel = async (channelId) => {
    if (!user) {
      toast.success('Sync simulated (Guest Mode)');
      return;
    }
    
    setIsSyncing(true);
    const toastId = toast.loading('Syncing YouTube analytics and videos...');
    try {
      const headers = await getAuthHeaders();
      const response = await measureRequest('/api/youtube/sync', {
        method: 'POST',
        headers,
        body: JSON.stringify({ channelId })
      });

      if (!response.ok) {
        let errText = 'Sync failed';
        try {
          const errData = await response.json();
          errText = errData.error || errText;
        } catch (_) {}
        throw new Error(errText);
      }

      toast.success('YouTube Channel synced successfully!', { id: toastId });
      
      // Update last sync time inside inspector panel
      setInspectorData(prev => ({
        ...prev,
        lastSyncTime: new Date().toLocaleTimeString()
      }));

      // Re-load the current channel to update page data
      await loadChannels(channelId);
    } catch (err) {
      console.error('Sync Error:', err);
      const showDetailed = import.meta.env.DEV;
      const msg = showDetailed ? err.message : 'Internal server error';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  // Verify YouTube Channel details
  const verifyChannel = async (channelUrlOrHandle, customApiKey = '') => {
    let normalizedInput = channelUrlOrHandle.trim();
    if (!normalizedInput.startsWith('UC') && !normalizedInput.startsWith('@') && !normalizedInput.includes('youtube.com/')) {
      normalizedInput = '@' + normalizedInput;
    }

    console.log("Verify clicked");
    console.log("Handle:", normalizedInput);

    if (!user) {
      if (!normalizedInput) throw new Error('Please enter a channel URL or handle');
      return {
        channelName: `${normalizedInput} (Verified Demo)`,
        channelId: 'UC_mock_verified_channel_id',
        youtubeHandle: normalizedInput,
        youtubeUrl: `https://youtube.com/${normalizedInput}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
        subscriberCount: 482901,
        videoCount: 142,
        viewCount: 12402910
      };
    }

    const headers = await getAuthHeaders();
    const response = await measureRequest('/api/youtube/verify', {
      method: 'POST',
      headers,
      body: JSON.stringify({ channelUrlOrHandle: normalizedInput, apiKey: customApiKey })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify channel');
    }

    return data.channel;
  };

  // Save channel info to DB
  const saveChannel = async (channelData, customApiKey = '') => {
    if (!user) {
      toast.success('Mock Channel connected (Guest Mode)');
      return;
    }

    const headers = await getAuthHeaders();
    const response = await measureRequest('/api/youtube/save', {
      method: 'POST',
      headers,
      body: JSON.stringify({ channelData, apiKey: customApiKey })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save channel');
    }

    toast.success(`Successfully connected ${data.channel.channel_name}!`);
    await loadChannels(data.channel.id);
    await syncChannel(data.channel.id);
  };

  // Periodically refresh the last-synced time indicator
  useEffect(() => {
    if (activeChannel?.updated_at) {
      updateLastSyncedText(activeChannel.updated_at);
      const interval = setInterval(() => {
        updateLastSyncedText(activeChannel.updated_at);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeChannel, updateLastSyncedText]);

  // Load channels list when user session or location changes
  useEffect(() => {
    loadChannels();
  }, [user, location.pathname, loadChannels]);

  return (
    <ChannelContext.Provider value={{
      channels,
      activeChannel,
      videos,
      analytics,
      isLoading,
      isSyncing,
      lastSyncedText,
      inspectorData,
      changeActiveChannel,
      syncChannel,
      verifyChannel,
      saveChannel
    }}>
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => useContext(ChannelContext);
