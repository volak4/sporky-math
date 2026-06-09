import { supabase } from '../lib/supabase.js';

const ADMIN_EMAIL = 'volak4@gmail.com';
let isAdmin = false;
let adminData = { users: [], sessions: [], funnel: {} };

export async function initAdmin() {
  const adminScreen = document.getElementById('admin-screen');
  const adminLoginGate = document.getElementById('admin-login-gate');
  const adminDashboard = document.getElementById('admin-dashboard');
  
  // Check if user is logged in and is admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user && user.email === ADMIN_EMAIL) {
    isAdmin = true;
    adminLoginGate.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    await loadDashboardData();
  } else {
    adminLoginGate.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    setupAdminLogin();
  }
}

function setupAdminLogin() {
  const form = document.getElementById('admin-login-form');
  const feedback = document.getElementById('admin-login-feedback');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    feedback.classList.add('hidden');
    
    if (email !== ADMIN_EMAIL) {
      feedback.textContent = '⛔ Access denied. Admin accounts only.';
      feedback.classList.remove('hidden');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Re-init after login
      await initAdmin();
    } catch (err) {
      feedback.textContent = err.message || 'Login failed.';
      feedback.classList.remove('hidden');
    }
  });
}

async function loadDashboardData() {
  // Show loading state
  document.getElementById('admin-loading').classList.remove('hidden');
  
  try {
    // Fetch all data in parallel
    const [sessionsResult, profilesResult] = await Promise.all([
      supabase.from('user_sessions').select('*').order('started_at', { ascending: false }).limit(200),
      supabase.from('sporky_profiles').select('*')
    ]);
    
    // Since we can't use auth.admin with anon key, we'll use sporky_profiles as user list
    const profiles = profilesResult.data || [];
    const sessions = sessionsResult.data || [];
    
    adminData.profiles = profiles;
    adminData.sessions = sessions;
    
    renderOverviewCards(profiles, sessions);
    renderUserTable(profiles, sessions);
    renderFunnel(sessions);
    renderSessionTimeline(sessions);
    
  } catch (e) {
    console.error('Admin data load error:', e);
  } finally {
    document.getElementById('admin-loading').classList.add('hidden');
  }
}

function renderOverviewCards(profiles, sessions) {
  const totalUsers = profiles.length;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const activeToday = sessions.filter(s => new Date(s.started_at) >= today).length;
  const activeWeek = sessions.filter(s => new Date(s.started_at) >= weekAgo).length;
  
  const durations = sessions.filter(s => s.duration_seconds > 0).map(s => s.duration_seconds);
  const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
  const avgMinutes = Math.floor(avgDuration / 60);
  const avgSeconds = avgDuration % 60;
  
  const totalSessions = sessions.length;
  
  document.getElementById('stat-total-users').textContent = totalUsers;
  document.getElementById('stat-active-today').textContent = activeToday;
  document.getElementById('stat-active-week').textContent = activeWeek;
  document.getElementById('stat-avg-duration').textContent = `${avgMinutes}m ${avgSeconds}s`;
  document.getElementById('stat-total-sessions').textContent = totalSessions;
}

function renderUserTable(profiles, sessions) {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;
  
  // Aggregate sessions per user
  const userSessionMap = {};
  sessions.forEach(s => {
    if (!s.user_id) return;
    if (!userSessionMap[s.user_id]) {
      userSessionMap[s.user_id] = { count: 0, totalTime: 0, maxLevel: 0, lastActive: null };
    }
    const entry = userSessionMap[s.user_id];
    entry.count++;
    entry.totalTime += s.duration_seconds || 0;
    entry.maxLevel = Math.max(entry.maxLevel, s.max_level_reached || 0);
    const startDate = new Date(s.started_at);
    if (!entry.lastActive || startDate > entry.lastActive) {
      entry.lastActive = startDate;
    }
  });
  
  // Build rows
  const rows = profiles.map(p => {
    const sessionInfo = userSessionMap[p.id] || { count: 0, totalTime: 0, maxLevel: 0, lastActive: null };
    const totalSolved = (p.challenge_1_solved || 0) + (p.challenge_2_solved || 0) + 
                       (p.challenge_3_solved || 0) + (p.challenge_4_solved || 0) + (p.challenge_5_solved || 0);
    
    return {
      id: p.id,
      updatedAt: p.updated_at,
      color: p.sporky_color || '#06b6d4',
      totalSolved,
      sessions: sessionInfo.count,
      totalTime: sessionInfo.totalTime,
      maxLevel: sessionInfo.maxLevel,
      lastActive: sessionInfo.lastActive,
      challengeData: {
        c1: p.challenge_1_solved || 0,
        c2: p.challenge_2_solved || 0,
        c3: p.challenge_3_solved || 0,
        c4: p.challenge_4_solved || 0,
        c5: p.challenge_5_solved || 0
      }
    };
  });
  
  // Sort by most recent activity
  rows.sort((a, b) => {
    const dateA = a.lastActive || new Date(a.updatedAt);
    const dateB = b.lastActive || new Date(b.updatedAt);
    return dateB - dateA;
  });
  
  tbody.innerHTML = rows.map((row, i) => {
    const timeStr = row.totalTime > 0 
      ? `${Math.floor(row.totalTime / 60)}m ${row.totalTime % 60}s`
      : '—';
    const lastActiveStr = row.lastActive 
      ? row.lastActive.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : new Date(row.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `<tr>
      <td>${i + 1}</td>
      <td><span class="user-color-dot" style="background:${row.color}"></span> ${row.id.substring(0, 8)}...</td>
      <td>${lastActiveStr}</td>
      <td>${row.sessions}</td>
      <td>${timeStr}</td>
      <td>Lv.${row.maxLevel || '—'}</td>
      <td>${row.totalSolved}</td>
      <td class="challenge-breakdown">
        <span title="Challenge 1">${row.challengeData.c1}</span> / 
        <span title="Challenge 2">${row.challengeData.c2}</span> / 
        <span title="Challenge 3">${row.challengeData.c3}</span> / 
        <span title="Challenge 4">${row.challengeData.c4}</span> / 
        <span title="Challenge 5">${row.challengeData.c5}</span>
      </td>
    </tr>`;
  }).join('');
  
  // Setup search
  const searchInput = document.getElementById('admin-user-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const trs = tbody.querySelectorAll('tr');
      trs.forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(query) ? '' : 'none';
      });
    });
  }
}

function renderFunnel(sessions) {
  const container = document.getElementById('admin-funnel-bars');
  if (!container) return;
  
  const total = sessions.length || 1;
  
  // Count by last_screen
  const screenCounts = { welcome: 0, map: 0, game: 0 };
  const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  
  sessions.forEach(s => {
    if (s.last_screen) screenCounts[s.last_screen] = (screenCounts[s.last_screen] || 0) + 1;
    if (s.max_level_reached) {
      for (let i = 1; i <= s.max_level_reached; i++) {
        levelCounts[i] = (levelCounts[i] || 0) + 1;
      }
    }
  });
  
  // Sessions that reached each stage
  const funnelStages = [
    { label: 'Visited Site', count: total, color: '#64748b' },
    { label: 'Reached Map', count: total - screenCounts.welcome, color: '#8b5cf6' },
    { label: 'Started Game', count: screenCounts.game + Object.values(levelCounts).reduce((a,b) => Math.max(a,b), 0), color: '#06b6d4' },
    { label: 'Level 1', count: levelCounts[1], color: '#22c55e' },
    { label: 'Level 2', count: levelCounts[2], color: '#eab308' },
    { label: 'Level 3', count: levelCounts[3], color: '#f97316' },
    { label: 'Level 4', count: levelCounts[4], color: '#ef4444' },
    { label: 'Level 5', count: levelCounts[5], color: '#ec4899' },
    { label: 'Level 6', count: levelCounts[6], color: '#a855f7' },
  ];
  
  const maxCount = funnelStages[0].count || 1;
  
  container.innerHTML = funnelStages.map(stage => {
    const pct = Math.round((stage.count / maxCount) * 100);
    return `<div class="funnel-row">
      <span class="funnel-label">${stage.label}</span>
      <div class="funnel-bar-track">
        <div class="funnel-bar-fill" style="width: ${Math.max(pct, 2)}%; background: ${stage.color};"></div>
      </div>
      <span class="funnel-count">${stage.count} <span class="funnel-pct">(${pct}%)</span></span>
    </div>`;
  }).join('');
}

function renderSessionTimeline(sessions) {
  const container = document.getElementById('admin-session-list');
  if (!container) return;
  
  const recent = sessions.slice(0, 30);
  
  container.innerHTML = recent.map(s => {
    const startDate = new Date(s.started_at);
    const dateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const durationStr = s.duration_seconds > 0 
      ? `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s` 
      : 'Active';
    const deviceIcon = s.device_type === 'mobile' ? '📱' : s.device_type === 'tablet' ? '📋' : '🖥️';
    const exitBadge = s.exit_trigger 
      ? `<span class="exit-badge exit-${s.exit_trigger}">${s.exit_trigger.replace('_', ' ')}</span>` 
      : '<span class="exit-badge exit-active">active</span>';
    
    const levelsStr = (s.levels_attempted || []).length > 0 
      ? `Levels: ${s.levels_attempted.sort().join(', ')}` 
      : 'No levels attempted';
    
    return `<div class="session-card">
      <div class="session-header">
        <span class="session-device">${deviceIcon}</span>
        <span class="session-date">${dateStr}</span>
        <span class="session-duration">${durationStr}</span>
        ${exitBadge}
      </div>
      <div class="session-details">
        <span class="session-screen">Last: <strong>${s.last_screen || 'welcome'}</strong></span>
        <span class="session-levels">${levelsStr}</span>
        ${s.max_level_reached ? `<span class="session-max-level">Peak: Lv.${s.max_level_reached}</span>` : ''}
      </div>
    </div>`;
  }).join('');
  
  if (recent.length === 0) {
    container.innerHTML = '<div class="session-empty">No sessions recorded yet. Data will appear as users visit the site.</div>';
  }
}

// Refresh button
export function setupRefresh() {
  const btn = document.getElementById('admin-refresh-btn');
  if (btn) {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = 'Refreshing...';
      await loadDashboardData();
      btn.disabled = false;
      btn.textContent = '↻ Refresh';
    });
  }
}
