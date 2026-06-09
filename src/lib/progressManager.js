import { supabase } from './supabase.js';

let solvedCounts = [0, 0, 0, 0, 0, 0]; // 6 challenges
let playerColor = '#06b6d4'; // Default Electric Blue/Cyan
let coins = 0;
let purchasedOutfits = ['jeans', 'tshirt'];
let activeOutfit = null;
let streakCount = 0;

export function getLocalSolvedCount(index) {
  return solvedCounts[index] || 0;
}

export function setLocalSolvedCount(index, count) {
  solvedCounts[index] = count;
}

export function getPlayerColor() {
  return playerColor;
}

export function setPlayerColor(color) {
  playerColor = color;
  saveProgress();
}

// --- Coins State Management ---
export function getCoins() {
  return coins;
}

export function addCoins(amount) {
  coins += amount;
  localStorage.setItem('sporky_coins', coins);
  saveProgress();
}

export function deductCoins(amount) {
  coins = Math.max(0, coins - amount);
  localStorage.setItem('sporky_coins', coins);
  saveProgress();
}

// --- Streak State Management ---
export function getStreak() {
  return streakCount;
}

// --- Outfits State Management ---
export function getPurchasedOutfits() {
  return purchasedOutfits;
}

export function getActiveOutfit() {
  return activeOutfit;
}

export function purchaseOutfit(outfitId, cost) {
  if (coins >= cost && !purchasedOutfits.includes(outfitId)) {
    deductCoins(cost);
    purchasedOutfits.push(outfitId);
    localStorage.setItem('sporky_purchased_outfits', JSON.stringify(purchasedOutfits));
    saveProgress();
    return true;
  }
  return false;
}

export function equipOutfit(outfitId) {
  if (outfitId === null || purchasedOutfits.includes(outfitId)) {
    activeOutfit = outfitId;
    localStorage.setItem('sporky_active_outfit', activeOutfit || '');
    saveProgress();
    return true;
  }
  return false;
}

// Increment solved count for a challenge and handle progressive payouts/streaks
export async function incrementSolvedCount(index) {
  solvedCounts[index] = (solvedCounts[index] || 0) + 1;
  
  // Progressive rewards: Level 1: $1, Level 2: $2, Level 3: $4, Level 4: $7, Level 5: $10, Level 6: $30
  const payouts = [1, 2, 4, 7, 10, 30];
  const baseReward = payouts[index] || 10;
  
  // Increment streak
  streakCount += 1;
  localStorage.setItem('sporky_streak', streakCount);
  
  // Calculate milestone bonuses
  let streakBonus = 0;
  if (streakCount === 3) {
    streakBonus = 3;
  } else if (streakCount === 5) {
    streakBonus = 7;
  } else if (streakCount === 10) {
    streakBonus = 20;
  }
  
  const totalEarned = baseReward + streakBonus;
  coins += totalEarned;
  localStorage.setItem('sporky_coins', coins);
  
  await saveProgress();
  return { baseReward, streakBonus, newStreak: streakCount, coinsEarned: totalEarned };
}

// Register an incorrect answer, reset streak, and deduct 1 coin
export function registerIncorrectAnswer() {
  streakCount = 0;
  localStorage.setItem('sporky_streak', 0);
  
  coins = Math.max(0, coins - 1);
  localStorage.setItem('sporky_coins', coins);
  
  saveProgress();
  return { newStreak: 0, coins };
}

// Reset progress back to 0 (useful for logging out or starting fresh)
export function resetLocalProgress() {
  solvedCounts = [0, 0, 0, 0, 0, 0];
  playerColor = '#06b6d4';
  coins = 0;
  purchasedOutfits = ['jeans', 'tshirt'];
  activeOutfit = null;
  streakCount = 0;
  localStorage.removeItem('sporky_coins');
  localStorage.removeItem('sporky_purchased_outfits');
  localStorage.removeItem('sporky_active_outfit');
  localStorage.removeItem('sporky_streak');
  localStorage.removeItem('sporky_solved_counts');
}

// Load progress from Supabase (if logged in) or LocalStorage (if guest)
export async function loadProgress() {
  const { data: { user } } = await supabase.auth.getUser();

  // Load coins, outfits, and streak from localStorage
  const localCoins = localStorage.getItem('sporky_coins');
  const localPurchased = localStorage.getItem('sporky_purchased_outfits');
  const localActive = localStorage.getItem('sporky_active_outfit');
  const localStreak = localStorage.getItem('sporky_streak');

  coins = localCoins ? parseInt(localCoins, 10) || 0 : 0;
  streakCount = localStreak ? parseInt(localStreak, 10) || 0 : 0;
  
  if (localPurchased) {
    try {
      purchasedOutfits = JSON.parse(localPurchased) || [];
      if (!purchasedOutfits.includes('jeans')) purchasedOutfits.push('jeans');
      if (!purchasedOutfits.includes('tshirt')) purchasedOutfits.push('tshirt');
    } catch (e) {
      purchasedOutfits = ['jeans', 'tshirt'];
    }
  } else {
    purchasedOutfits = ['jeans', 'tshirt'];
  }

  activeOutfit = localActive || null;

  if (user) {
    // 1. Fetch from Supabase remote database
    const { data, error } = await supabase
      .from('sporky_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      solvedCounts[0] = data.challenge_1_solved || 0;
      solvedCounts[1] = data.challenge_2_solved || 0;
      solvedCounts[2] = data.challenge_3_solved || 0;
      solvedCounts[3] = data.challenge_4_solved || 0;
      solvedCounts[4] = data.challenge_5_solved || 0;
      
      // Fallback for challenge 6 count from LocalStorage
      const localCounts = localStorage.getItem('sporky_solved_counts');
      if (localCounts) {
        try {
          const arr = JSON.parse(localCounts);
          solvedCounts[5] = arr[5] || 0;
        } catch (e) {
          solvedCounts[5] = 0;
        }
      } else {
        solvedCounts[5] = 0;
      }
      
      playerColor = data.sporky_color || '#06b6d4';
      return { 
        source: 'database', 
        color: playerColor, 
        counts: [...solvedCounts],
        coins: coins,
        activeOutfit: activeOutfit,
        purchasedOutfits: purchasedOutfits
      };
    }
  }

  // 2. Fallback to LocalStorage (guest mode)
  const localCounts = localStorage.getItem('sporky_solved_counts');
  const localColor = localStorage.getItem('sporky_color');
  
  if (localCounts) {
    try {
      solvedCounts = JSON.parse(localCounts);
      // Pad to 6 elements if loaded array is smaller
      while (solvedCounts.length < 6) {
        solvedCounts.push(0);
      }
    } catch (e) {
      solvedCounts = [0, 0, 0, 0, 0, 0];
    }
  } else {
    solvedCounts = [0, 0, 0, 0, 0, 0];
  }
  
  playerColor = localColor || '#06b6d4';
  return { 
    source: 'local', 
    color: playerColor, 
    counts: [...solvedCounts],
    coins: coins,
    activeOutfit: activeOutfit,
    purchasedOutfits: purchasedOutfits
  };
}

// Save progress to Supabase or LocalStorage
export async function saveProgress() {
  const { data: { user } } = await supabase.auth.getUser();

  // Save coins, outfits, streak, and solved counts locally in all cases
  localStorage.setItem('sporky_coins', coins);
  localStorage.setItem('sporky_purchased_outfits', JSON.stringify(purchasedOutfits));
  localStorage.setItem('sporky_active_outfit', activeOutfit || '');
  localStorage.setItem('sporky_streak', streakCount);
  localStorage.setItem('sporky_solved_counts', JSON.stringify(solvedCounts));

  if (user) {
    // Save to remote database (excluding challenge_6_solved to prevent schema column mismatches)
    const { error } = await supabase
      .from('sporky_profiles')
      .upsert({
        id: user.id,
        sporky_color: playerColor,
        challenge_1_solved: solvedCounts[0],
        challenge_2_solved: solvedCounts[1],
        challenge_3_solved: solvedCounts[2],
        challenge_4_solved: solvedCounts[3],
        challenge_5_solved: solvedCounts[4],
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error saving progress to database:', error);
    }
  } else {
    // Save color locally
    localStorage.setItem('sporky_color', playerColor);
  }
}

// Sync guest progress (LocalStorage) into remote account when logging in
export async function syncGuestProgressToAccount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Fetch current remote progress
  const { data, error } = await supabase
    .from('sporky_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 2. Fetch local guest progress
  const localCountsStr = localStorage.getItem('sporky_solved_counts');
  const localColor = localStorage.getItem('sporky_color');
  let guestCounts = [0, 0, 0, 0, 0, 0];
  if (localCountsStr) {
    try {
      guestCounts = JSON.parse(localCountsStr);
      while (guestCounts.length < 6) {
        guestCounts.push(0);
      }
    } catch (e) {}
  }

  // 3. Merge progress: take the maximum solved counts for each challenge
  if (!error && data) {
    solvedCounts[0] = Math.max(data.challenge_1_solved || 0, guestCounts[0]);
    solvedCounts[1] = Math.max(data.challenge_2_solved || 0, guestCounts[1]);
    solvedCounts[2] = Math.max(data.challenge_3_solved || 0, guestCounts[2]);
    solvedCounts[3] = Math.max(data.challenge_4_solved || 0, guestCounts[3]);
    solvedCounts[4] = Math.max(data.challenge_5_solved || 0, guestCounts[4]);
    solvedCounts[5] = guestCounts[5] || 0; // Local-only
    playerColor = localColor || data.sporky_color || '#06b6d4';
  } else {
    solvedCounts = [...guestCounts];
    playerColor = localColor || '#06b6d4';
  }

  // 4. Save merged progress
  await saveProgress();
}
