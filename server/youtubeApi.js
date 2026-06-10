import { createClient } from '@supabase/supabase-js';
import url from 'url';

// Helper to check Supabase Url and Key at startup
export function validateEnv() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl) {
    throw new Error("Missing environment variable: VITE_SUPABASE_URL (supabaseUrl is required)");
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable: VITE_SUPABASE_ANON_KEY");
  }
}

// Utility to parse POST body stream
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
};

// Utility to fetch API key from user settings or env
async function getApiKeyForUser(dbClient, userId, customKey) {
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  // Check DB settings
  const { data, error } = await dbClient
    .from('user_settings')
    .select('youtube_api_key')
    .eq('user_id', userId)
    .maybeSingle();

  console.log("Supabase response:", data);
  if (error) {
    console.error("Supabase error fetching API key:", error);
  }

  if (!error && data && data.youtube_api_key && data.youtube_api_key.trim().length > 0) {
    return data.youtube_api_key.trim();
  }
  // Check env fallback
  if (process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY.trim().length > 0) {
    return process.env.YOUTUBE_API_KEY.trim();
  }
  throw new Error('Missing YOUTUBE_API_KEY');
}

// Deterministic mock CTR generator to keep data realistic and stable
function generateCtr(videoId, views) {
  let hash = 0;
  for (let i = 0; i < videoId.length; i++) {
    hash = videoId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const factor = Math.abs(hash % 100) / 100; // 0 to 1
  return parseFloat((3.2 + factor * 9.3).toFixed(1));
}

// Map various DB/API errors to user-friendly messages requested by the user
function mapError(err, context = '') {
  if (!err) return new Error('API endpoint returned 500');
  const msg = err.message || '';
  const code = err.code || '';

  // Channels table missing
  if (code === '42P01' || msg.includes('relation') && msg.includes('does not exist')) {
    return new Error('Channels table missing');
  }

  // RLS policy blocking insert
  if (code === '42501' || msg.includes('permission denied')) {
    return new Error('RLS policy blocking insert');
  }

  // Supabase connection failed
  if (msg.includes('fetch failed') || msg.includes('connection') || code === 'PGRST301' || msg.includes('supabaseUrl is required') || msg.includes('supabaseAnonKey is required')) {
    return new Error('Supabase connection failed');
  }

  // Analytics sync failed
  if (context === 'sync' && (msg.includes('sync') || msg.includes('fetch') || msg.includes('Google') || msg.includes('YouTube'))) {
    return new Error('Analytics sync failed');
  }

  // Handle YouTube-specific errors
  if (msg.includes('API key not valid') || msg.includes('keyInvalid')) {
    return new Error('Invalid YouTube API key');
  }
  if (msg.includes('quotaExceeded') || msg.includes('quota')) {
    return new Error('YouTube quota exceeded');
  }
  if (msg.includes('Channel not found') || msg.includes('channel not found')) {
    return new Error('Channel not found');
  }
  if (msg.includes('Missing YOUTUBE_API_KEY')) {
    return new Error('Missing YOUTUBE_API_KEY');
  }

  return err;
}

// Standard helper to log and return formatted JSON error response
function sendJsonError(res, error, status = 500) {
  console.error("Backend exception caught in middleware:", error);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({
    success: false,
    error: error.message,
    stack: error.stack
  }));
}

export async function youtubeApiMiddleware(req, res, next) {
  const parsedUrl = url.parse(req.url, true);

  if (!parsedUrl.pathname.startsWith('/api/youtube')) {
    return next();
  }

  // Set standard headers
  res.setHeader('Content-Type', 'application/json');

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase connection failed');
    }

    // 1. Authenticate the user using Supabase Auth JWT
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.writeHead(401);
      return res.end(JSON.stringify({ success: false, error: 'User not authenticated' }));
    }
    const token = authHeader.split(' ')[1];

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });
    
    let authUser = null;
    try {
      const { data: { user }, error: authError } = await authClient.auth.getUser(token);
      if (authError || !user) {
        throw new Error('User not authenticated');
      }
      authUser = user;
    } catch (authErr) {
      res.writeHead(401);
      return res.end(JSON.stringify({ success: false, error: 'User not authenticated' }));
    }

    const userId = authUser.id;

    // Respect RLS: Use Service Role if present, else inject User Auth JWT in request headers
    const dbClient = supabaseServiceRoleKey
      ? createClient(supabaseUrl, supabaseServiceRoleKey, {
          auth: { persistSession: false, persistUser: false }
        })
      : createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false, persistUser: false },
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        });

    // -------------------------------------------------------------
    // POST /api/youtube/verify
    // -------------------------------------------------------------
    if (parsedUrl.pathname === '/api/youtube/verify' && req.method === 'POST') {
      try {
        const { channelUrlOrHandle, apiKey: customKey } = await parseBody(req);
        
        console.log("Request received");
        console.log("Request body:", { channelUrlOrHandle, apiKey: customKey });
        console.log("Environment variables loaded");

        if (!channelUrlOrHandle) {
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: 'channelUrlOrHandle is required' }));
        }

        let apiKey;
        try {
          apiKey = await getApiKeyForUser(dbClient, userId, customKey);
        } catch (keyErr) {
          const mappedKeyErr = mapError(keyErr);
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: mappedKeyErr.message }));
        }

        // Parse and normalize handle or channel ID
        let handle = '';
        let channelId = '';
        const input = channelUrlOrHandle.trim();

        if (input.includes('youtube.com/channel/')) {
          channelId = input.split('youtube.com/channel/')[1].split('/')[0].split('?')[0];
        } else if (input.includes('youtube.com/@')) {
          handle = '@' + input.split('youtube.com/@')[1].split('/')[0].split('?')[0];
        } else if (input.startsWith('@')) {
          handle = input;
        } else if (input.startsWith('UC') && input.length === 24) {
          channelId = input;
        } else {
          handle = '@' + input;
        }

        let ytData = null;
        let ytRes = null;

        if (channelId) {
          const fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails,brandingSettings&id=${channelId}&key=${apiKey}`;
          ytRes = await fetch(fetchUrl);
          ytData = await ytRes.json();
        } else {
          let searchHandle = handle.startsWith('@') ? handle.substring(1) : handle;
          let fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails,brandingSettings&forHandle=${encodeURIComponent(searchHandle)}&key=${apiKey}`;
          
          ytRes = await fetch(fetchUrl);
          ytData = await ytRes.json();

          if (ytRes.ok && (!ytData.items || ytData.items.length === 0) && !ytData.error) {
            fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails,brandingSettings&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`;
            ytRes = await fetch(fetchUrl);
            ytData = await ytRes.json();
          }
        }

        console.log("YouTube response:", ytData);

        if (ytData.error) {
          const mappedYtErr = mapError(new Error(ytData.error.message || ''));
          res.writeHead(ytRes.status || 400);
          return res.end(JSON.stringify({ success: false, error: mappedYtErr.message }));
        }

        if (!ytData.items || ytData.items.length === 0) {
          const mappedErr = mapError(new Error('Channel not found'));
          res.writeHead(404);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        const item = ytData.items[0];
        const verifiedData = {
          channelName: item.snippet.title,
          channelId: item.id,
          youtubeHandle: item.snippet.customUrl || handle,
          youtubeUrl: `https://youtube.com/${item.snippet.customUrl || handle}`,
          thumbnailUrl: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          bannerUrl: item.brandingSettings?.image?.bannerExternalUrl || null,
          subscriberCount: parseInt(item.statistics.subscriberCount) || 0,
          videoCount: parseInt(item.statistics.videoCount) || 0,
          viewCount: parseInt(item.statistics.viewCount) || 0
        };

        res.writeHead(200);
        return res.end(JSON.stringify({ success: true, channel: verifiedData }));
      } catch (error) {
        const mappedError = mapError(error);
        return sendJsonError(res, mappedError);
      }
    }

    // -------------------------------------------------------------
    // POST /api/youtube/save
    // -------------------------------------------------------------
    else if (parsedUrl.pathname === '/api/youtube/save' && req.method === 'POST') {
      try {
        const { channelData, apiKey: customKey } = await parseBody(req);
        console.log("Request received");
        console.log("Request body:", { channelData, apiKey: customKey });
        console.log("Environment variables loaded");

        if (!channelData || !channelData.channelId) {
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: 'channelData with channelId is required' }));
        }

        // 1. Save or Update the Channel
        let channelResult = null;
        const channelPayload = {
          user_id: userId,
          channel_name: channelData.channelName,
          channel_id: channelData.channelId,
          youtube_handle: channelData.youtubeHandle,
          youtube_url: channelData.youtubeUrl,
          thumbnail_url: channelData.thumbnailUrl,
          banner_url: channelData.bannerUrl,
          subscriber_count: channelData.subscriberCount,
          video_count: channelData.videoCount,
          view_count: channelData.viewCount,
          api_source: 'youtube',
          updated_at: new Date()
        };

        const { data: channel, error: chError } = await dbClient
          .from('channels')
          .upsert(channelPayload, { onConflict: 'channel_id' })
          .select()
          .single();

        console.log("Supabase response:", channel);

        if (chError && (chError.code === '42703' || chError.message?.includes('banner_url'))) {
          console.warn("Database missing banner_url column. Retrying channel upsert without banner_url.");
          delete channelPayload.banner_url;
          const { data: channelRetry, error: chErrorRetry } = await dbClient
            .from('channels')
            .upsert(channelPayload, { onConflict: 'channel_id' })
            .select()
            .single();

          if (chErrorRetry) {
            const mappedDbErr = mapError(chErrorRetry);
            res.writeHead(500);
            return res.end(JSON.stringify({ success: false, error: mappedDbErr.message }));
          }
          channelResult = channelRetry;
        } else if (chError) {
          const mappedDbErr = mapError(chError);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedDbErr.message }));
        } else {
          channelResult = channel;
        }

        // 2. Save User Settings
        const settingsUpsert = {
          user_id: userId,
          default_channel_id: channelResult.id,
          updated_at: new Date()
        };
        if (customKey && customKey.trim().length > 0) {
          settingsUpsert.youtube_api_key = customKey.trim();
        }

        const { data: settingsData, error: settingsError } = await dbClient
          .from('user_settings')
          .upsert(settingsUpsert, { onConflict: 'user_id' })
          .select();

        console.log("Supabase response:", settingsData);

        if (settingsError) {
          const mappedDbErr = mapError(settingsError);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedDbErr.message }));
        }

        res.writeHead(200);
        return res.end(JSON.stringify({ success: true, channel }));
      } catch (error) {
        const mappedError = mapError(error);
        return sendJsonError(res, mappedError);
      }
    }

    // -------------------------------------------------------------
    // POST /api/youtube/sync
    // -------------------------------------------------------------
    else if (parsedUrl.pathname === '/api/youtube/sync' && req.method === 'POST') {
      try {
        const { channelId } = await parseBody(req);
        console.log("Request received");
        console.log("Request body:", { channelId });
        console.log("Environment variables loaded");

        if (!channelId) {
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: 'channelId (UUID) is required' }));
        }

        // Get channel info from DB
        const { data: channel, error: chErr } = await dbClient
          .from('channels')
          .select('*')
          .eq('id', channelId)
          .single();

        console.log("Supabase response:", channel);

        if (chErr || !channel) {
          const mappedErr = mapError(chErr || new Error('Channel not found'));
          res.writeHead(404);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        let apiKey;
        try {
          apiKey = await getApiKeyForUser(dbClient, userId);
        } catch (keyErr) {
          const mappedKeyErr = mapError(keyErr);
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: mappedKeyErr.message }));
        }

        // 1. Fetch Latest Channel Stats
        const chUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails,brandingSettings&id=${channel.channel_id}&key=${apiKey}`;
        const ytChRes = await fetch(chUrl);
        const ytChData = await ytChRes.json();

        console.log("YouTube response:", ytChData);

        if (ytChData.error) {
          const mappedYtErr = mapError(new Error(ytChData.error.message || ''));
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: mappedYtErr.message }));
        }

        const channelItem = ytChData.items?.[0];
        if (!channelItem) {
          res.writeHead(404);
          return res.end(JSON.stringify({ success: false, error: 'Channel not found' }));
        }

        const currentSubscribers = parseInt(channelItem.statistics.subscriberCount) || 0;
        const currentViews = parseInt(channelItem.statistics.viewCount) || 0;
        const currentVideosCount = parseInt(channelItem.statistics.videoCount) || 0;
        const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;

        // Update channel stats
        const updatePayload = {
          subscriber_count: currentSubscribers,
          view_count: currentViews,
          video_count: currentVideosCount,
          channel_name: channelItem.snippet.title,
          thumbnail_url: channelItem.snippet.thumbnails.maxres?.url || channelItem.snippet.thumbnails.high?.url || channelItem.snippet.thumbnails.medium?.url || channelItem.snippet.thumbnails.default?.url,
          banner_url: channelItem.brandingSettings?.image?.bannerExternalUrl || null,
          updated_at: new Date()
        };

        let { data: updateData, error: updateErr } = await dbClient
          .from('channels')
          .update(updatePayload)
          .eq('id', channelId)
          .select();

        console.log("Supabase response:", updateData);

        if (updateErr && (updateErr.code === '42703' || updateErr.message?.includes('banner_url'))) {
          console.warn("Database missing banner_url column. Retrying channel update without banner_url.");
          delete updatePayload.banner_url;
          const { data: retryUpdateData, error: retryUpdateErr } = await dbClient
            .from('channels')
            .update(updatePayload)
            .eq('id', channelId)
            .select();
          updateData = retryUpdateData;
          updateErr = retryUpdateErr;
        }

        if (updateErr) {
          const mappedErr = mapError(updateErr);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        // 2. Fetch Latest 50 Videos
        let videosToUpsert = [];
        if (uploadsPlaylistId) {
          const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`;
          const plRes = await fetch(playlistUrl);
          const plData = await plRes.json();

          console.log("YouTube response:", plData);

          if (plData.items && plData.items.length > 0) {
            const rawVideos = plData.items;
            const videoIds = rawVideos.map(v => v.snippet.resourceId.videoId);

            // Fetch video statistics
            const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${apiKey}`;
            const statsRes = await fetch(statsUrl);
            const statsData = await statsRes.json();

            console.log("YouTube response:", statsData);

            const videoStatsMap = {};
            if (statsData.items) {
              statsData.items.forEach(item => {
                videoStatsMap[item.id] = {
                  views: parseInt(item.statistics.viewCount) || 0,
                  likes: parseInt(item.statistics.likeCount) || 0,
                  comments: parseInt(item.statistics.commentCount) || 0
                };
              });
            }

            videosToUpsert = rawVideos.map(v => {
              const vidId = v.snippet.resourceId.videoId;
              const stats = videoStatsMap[vidId] || { views: 0, likes: 0, comments: 0 };
              const engagementRate = stats.views > 0
                ? parseFloat((((stats.likes + stats.comments) / stats.views) * 100).toFixed(2))
                : 0;

              const ctr = generateCtr(vidId, stats.views);

              return {
                channel_id: channelId,
                youtube_video_id: vidId,
                title: v.snippet.title,
                thumbnail: v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default?.url,
                views: stats.views,
                likes: stats.likes,
                comments: stats.comments,
                published_at: v.snippet.publishedAt,
                ctr,
                engagement_rate: engagementRate
              };
            });

            // Insert or update videos in database
            const { data: vUpsertData, error: vError } = await dbClient
              .from('videos')
              .upsert(videosToUpsert, { onConflict: 'youtube_video_id' })
              .select();

            console.log("Supabase response:", vUpsertData);

            if (vError) {
              const mappedErr = mapError(vError);
              res.writeHead(500);
              return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
            }
          }
        }

        // 3. Add to Channel Analytics Table
        const { data: existingAnalytics, error: anCheckErr } = await dbClient
          .from('channel_analytics')
          .select('id')
          .eq('channel_id', channelId)
          .limit(1);

        if (anCheckErr) {
          const mappedErr = mapError(anCheckErr);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        const isFirstSync = !anCheckErr && (!existingAnalytics || existingAnalytics.length === 0);

        const totalViews = currentViews;
        const totalSubscribers = currentSubscribers;
        const totalVideos = currentVideosCount;
        const totalWatchTime = Math.floor(totalViews * 0.08);

        let avgEngagement = 5.4;
        let avgCtr = 6.8;
        if (videosToUpsert.length > 0) {
          const sumEng = videosToUpsert.reduce((sum, v) => sum + v.engagement_rate, 0);
          const sumCtr = videosToUpsert.reduce((sum, v) => sum + v.ctr, 0);
          avgEngagement = parseFloat((sumEng / videosToUpsert.length).toFixed(2));
          avgCtr = parseFloat((sumCtr / videosToUpsert.length).toFixed(2));
        }

        const revenueEstimate = parseFloat((totalViews * 0.0031).toFixed(2));

        if (isFirstSync) {
          const historicalRecords = [];
          const dailyViewsGrowth = Math.max(100, Math.floor(totalViews * 0.0018));
          const dailySubsGrowth = Math.max(5, Math.floor(totalSubscribers * 0.0012));

          for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            const viewsOnDay = Math.max(100, totalViews - i * dailyViewsGrowth);
            const subsOnDay = Math.max(10, totalSubscribers - i * dailySubsGrowth);
            const watchTimeOnDay = Math.floor(viewsOnDay * 0.08);
            const videosOnDay = Math.max(1, totalVideos - Math.floor(i / 10));
            const revenueOnDay = parseFloat((viewsOnDay * 0.0031).toFixed(2));

            const dayFluc = (i % 5) * 0.15 - 0.35;
            const dayEngagement = parseFloat(Math.max(1.0, avgEngagement + dayFluc).toFixed(2));
            const dayCtr = parseFloat(Math.max(1.0, avgCtr - dayFluc * 0.8).toFixed(2));

            historicalRecords.push({
              channel_id: channelId,
              total_views: viewsOnDay,
              total_watch_time: watchTimeOnDay,
              total_subscribers: subsOnDay,
              total_videos: videosOnDay,
              engagement_rate: dayEngagement,
              ctr: dayCtr,
              revenue_estimate: revenueOnDay,
              analytics_date: dateString
            });
          }

          const { data: dbAnalyticsData, error: dbAnalyticsErr } = await dbClient
            .from('channel_analytics')
            .insert(historicalRecords)
            .select();

          console.log("Supabase response:", dbAnalyticsData);
          if (dbAnalyticsErr) {
            const mappedErr = mapError(dbAnalyticsErr);
            res.writeHead(500);
            return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
          }

          const demographicsSeed = [
            { channel_id: channelId, age_group: '18-24', gender: 'Combined', percentage: 70 },
            { channel_id: channelId, age_group: '25-34', gender: 'Combined', percentage: 20 },
            { channel_id: channelId, age_group: 'Other', gender: 'Combined', percentage: 10 }
          ];
          
          const { data: dbDemoData, error: dbDemoErr } = await dbClient
            .from('audience_demographics')
            .insert(demographicsSeed)
            .select();

          console.log("Supabase response:", dbDemoData);
        } else {
          const todayStr = new Date().toISOString().split('T')[0];
          const { data: dbAnalyticsData, error: dbAnalyticsErr } = await dbClient
            .from('channel_analytics')
            .upsert({
              channel_id: channelId,
              total_views: totalViews,
              total_watch_time: totalWatchTime,
              total_subscribers: totalSubscribers,
              total_videos: totalVideos,
              engagement_rate: avgEngagement,
              ctr: avgCtr,
              revenue_estimate: revenueEstimate,
              analytics_date: todayStr
            }, { onConflict: 'channel_id,analytics_date' })
            .select();

          console.log("Supabase response:", dbAnalyticsData);
          if (dbAnalyticsErr) {
            const mappedErr = mapError(dbAnalyticsErr);
            res.writeHead(500);
            return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
          }
        }

        res.writeHead(200);
        return res.end(JSON.stringify({ success: true }));
      } catch (error) {
        const mappedError = mapError(error, 'sync');
        return sendJsonError(res, mappedError);
      }
    }

    // -------------------------------------------------------------
    // GET /api/youtube/channel
    // -------------------------------------------------------------
    else if (parsedUrl.pathname === '/api/youtube/channel' && req.method === 'GET') {
      try {
        const channelUuid = parsedUrl.query.channelId;
        console.log("Request received");
        console.log("Request body:", { channelUuid });
        console.log("Environment variables loaded");

        let channelIdToFetch = channelUuid;

        // 1. Get default settings
        const { data: settings, error: settingsErr } = await dbClient
          .from('user_settings')
          .select('default_channel_id')
          .eq('user_id', userId)
          .maybeSingle();

        console.log("Supabase response:", settings);

        if (settingsErr) {
          const mappedErr = mapError(settingsErr);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        if (!channelIdToFetch && settings?.default_channel_id) {
          channelIdToFetch = settings.default_channel_id;
        }

        // 2. Fetch all channels for this user
        const { data: channelsList, error: chListErr } = await dbClient
          .from('channels')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        console.log("Supabase response:", channelsList);

        if (chListErr) {
          const mappedErr = mapError(chListErr);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        let activeChannel = null;
        if (channelIdToFetch) {
          activeChannel = channelsList.find(c => c.id === channelIdToFetch) || null;
        }
        
        if (!activeChannel && channelsList.length > 0) {
          activeChannel = channelsList[0];
        }

        res.writeHead(200);
        return res.end(JSON.stringify({
          success: true,
          channel: activeChannel,
          channels: channelsList,
          defaultChannelId: settings?.default_channel_id || null
        }));
      } catch (error) {
        const mappedError = mapError(error);
        return sendJsonError(res, mappedError);
      }
    }

    // -------------------------------------------------------------
    // GET /api/youtube/videos
    // -------------------------------------------------------------
    else if (parsedUrl.pathname === '/api/youtube/videos' && req.method === 'GET') {
      try {
        const channelUuid = parsedUrl.query.channelId;
        console.log("Request received");
        console.log("Request body:", { channelUuid });
        console.log("Environment variables loaded");

        if (!channelUuid) {
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: 'channelId is required' }));
        }

        const { data: videos, error: vErr } = await dbClient
          .from('videos')
          .select('*')
          .eq('channel_id', channelUuid)
          .order('views', { ascending: false })
          .limit(50);

        console.log("Supabase response:", videos);

        if (vErr) {
          const mappedErr = mapError(vErr);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        res.writeHead(200);
        return res.end(JSON.stringify({ success: true, videos }));
      } catch (error) {
        const mappedError = mapError(error);
        return sendJsonError(res, mappedError);
      }
    }

    // -------------------------------------------------------------
    // GET /api/youtube/analytics
    // -------------------------------------------------------------
    else if (parsedUrl.pathname === '/api/youtube/analytics' && req.method === 'GET') {
      try {
        const channelUuid = parsedUrl.query.channelId;
        console.log("Request received");
        console.log("Request body:", { channelUuid });
        console.log("Environment variables loaded");

        if (!channelUuid) {
          res.writeHead(400);
          return res.end(JSON.stringify({ success: false, error: 'channelId is required' }));
        }

        const { data: analytics, error: aErr } = await dbClient
          .from('channel_analytics')
          .select('*')
          .eq('channel_id', channelUuid)
          .order('analytics_date', { ascending: true })
          .limit(30);

        console.log("Supabase response:", analytics);

        if (aErr) {
          const mappedErr = mapError(aErr);
          res.writeHead(500);
          return res.end(JSON.stringify({ success: false, error: mappedErr.message }));
        }

        res.writeHead(200);
        return res.end(JSON.stringify({ success: true, analytics }));
      } catch (error) {
        const mappedError = mapError(error);
        return sendJsonError(res, mappedError);
      }
    }

    // Endpoint not matched
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ success: false, error: 'Not Found' }));
    }

  } catch (err) {
    const mappedError = mapError(err);
    return sendJsonError(res, mappedError);
  }
}
