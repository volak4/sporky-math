import { supabase } from './supabase.js';

let currentSessionId = null;
let sessionStartTime = null;
let currentSessionRow = null;

function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function detectDeviceType() {
  const width = window.innerWidth;
  if (width <= 480) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

export async function startSession() {
  currentSessionId = generateSessionId();
  sessionStartTime = Date.now();
  
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        session_id: currentSessionId,
        device_type: detectDeviceType(),
        last_screen: 'welcome',
        user_id: (await supabase.auth.getUser())?.data?.user?.id || null
      })
      .select('id')
      .single();
    
    if (data) {
      currentSessionRow = data.id;
    }
  } catch (e) {
    console.warn('Session tracking unavailable:', e.message);
  }
  
  // Register exit handlers
  window.addEventListener('beforeunload', () => endSession('tab_close'));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      endSession('navigate_away');
    }
  });
}

export async function trackScreenChange(screenName) {
  if (!currentSessionRow) return;
  try {
    await supabase
      .from('user_sessions')
      .update({ last_screen: screenName })
      .eq('id', currentSessionRow);
  } catch (e) { /* silent */ }
}

export async function trackLevelChange(levelIndex) {
  if (!currentSessionRow) return;
  try {
    // Use RPC or raw update - fetch current then update
    const { data } = await supabase
      .from('user_sessions')
      .select('max_level_reached, levels_attempted')
      .eq('id', currentSessionRow)
      .single();
    
    if (data) {
      const maxLevel = Math.max(data.max_level_reached || 0, levelIndex + 1);
      const attempted = data.levels_attempted || [];
      if (!attempted.includes(levelIndex + 1)) {
        attempted.push(levelIndex + 1);
      }
      
      await supabase
        .from('user_sessions')
        .update({
          max_level_reached: maxLevel,
          levels_attempted: attempted
        })
        .eq('id', currentSessionRow);
    }
  } catch (e) { /* silent */ }
}

export function endSession(trigger = 'tab_close') {
  if (!currentSessionRow || !sessionStartTime) return;
  const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
  
  // Use fetch with keepalive for reliable delivery on page unload
  const url = `${supabase.supabaseUrl}/rest/v1/user_sessions?id=eq.${currentSessionRow}`;
  const body = JSON.stringify({
    ended_at: new Date().toISOString(),
    duration_seconds: durationSeconds,
    exit_trigger: trigger
  });
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabase.supabaseKey,
    'Authorization': `Bearer ${supabase.supabaseKey}`,
    'Prefer': 'return=minimal'
  };
  
  try {
    fetch(url, {
      method: 'PATCH',
      headers,
      body,
      keepalive: true
    }).catch(() => {});
  } catch (e) { /* last resort - data is lost but that's OK */ }
  
  // Prevent double-sending
  currentSessionRow = null;
}
