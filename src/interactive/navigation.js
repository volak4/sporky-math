import { setClimberColor } from '../engine/climber.js';
import { setWelcomeSporkyColor, resumeWelcomeSporky } from '../engine/welcomeSporky.js';
import { initSidebarCharacter, stopSidebarCharacter, updateSidebarCharacterColor } from '../engine/sidebarCharacter.js';
import { updateCoinDisplays } from './uiController.js';
import { supabase } from '../lib/supabase.js';
import { trackScreenChange, trackLevelChange } from '../lib/sessionTracker.js';
import { 
  getPlayerColor, 
  setPlayerColor, 
  loadProgress, 
  saveProgress, 
  syncGuestProgressToAccount, 
  getLocalSolvedCount 
} from '../lib/progressManager.js';

let selectedColor = '#06b6d4'; // Current selection
let activeAuthTab = 'signin'; // 'signin' or 'signup'

export function getSelectedColor() {
  return selectedColor;
}

// Colors definitions matching the customization swatches
export const SPORKY_COLORS = {
  cyan: '#06b6d4',
  green: '#22c55e',
  pink: '#ec4899',
  purple: '#a855f7',
  orange: '#f97316',
  yellow: '#eab308'
};

export async function initNavigation() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const mapScreen = document.getElementById('map-screen');
  const gameScreen = document.getElementById('game-screen');
  
  const btnEnterGame = document.getElementById('btn-enter-game');
  const btnBackToWelcome = document.getElementById('btn-back-to-welcome');
  const btnBackToMap = document.getElementById('btn-back-to-map');
  const btnOpenCustomizer = document.getElementById('btn-open-customizer');
  const btnCloseCustomizer = document.getElementById('btn-close-customizer');
  
  const customizerModal = document.getElementById('color-customizer-modal');
  const swatches = document.querySelectorAll('.color-swatch, .color-swatch-welcome');
  const mapSporkyIndicator = document.getElementById('map-sporky-indicator');
  
  const mapRegions = document.querySelectorAll('.map-region-card');
  const modalOverlay = document.getElementById('locked-region-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalEmoji = document.getElementById('modal-emoji');

  // Auth Modal Elements
  const authModal = document.getElementById('auth-modal');
  const btnWelcomeSignin = document.getElementById('btn-welcome-signin');
  const authCloseBtn = document.getElementById('auth-close-btn');
  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const authForm = document.getElementById('auth-form');
  const authEmailInput = document.getElementById('auth-email');
  const authPasswordInput = document.getElementById('auth-password');
  const btnAuthSubmit = document.getElementById('btn-auth-submit');
  const authFeedback = document.getElementById('auth-feedback');
  const btnForgotPassword = document.getElementById('btn-forgot-password');
  const authModalTitle = document.getElementById('auth-modal-title');

  // Helper to apply colors to UI indicators
  function updateUIColor(hexColor) {
    if (mapSporkyIndicator) {
      mapSporkyIndicator.style.backgroundColor = hexColor;
    }
    // Update active swatch class
    const colorKey = Object.keys(SPORKY_COLORS).find(key => SPORKY_COLORS[key] === hexColor);
    if (colorKey) {
      swatches.forEach(sw => {
        if (sw.dataset.color === colorKey) {
          sw.classList.add('active');
        } else {
          sw.classList.remove('active');
        }
      });
    }
  }

  // Helper to load solved counts and display them
  async function refreshProgressUI() {
    const progressData = await loadProgress();
    selectedColor = progressData.color;
    updateUIColor(selectedColor);
    setClimberColor(selectedColor);
    setWelcomeSporkyColor(selectedColor);
    updateCoinDisplays();
    updateSidebarCharacterColor(selectedColor);
  }

  // Load initial progress (loads from local or db depending on session)
  await refreshProgressUI();

  // Check if we arrived directly via the /slopes route (which is intended for the slopes exercise)
  const isDirectSlopesPath = window.location.pathname.endsWith('/slopes') || window.location.pathname.endsWith('/slopes/');
  if (isDirectSlopesPath) {
    welcomeScreen.classList.add('hidden');
    mapScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Update Three.js Sporky color
    setClimberColor(selectedColor);
    
    // Initialize sidebar character preview
    const sidebarContainer = document.getElementById('sidebar-character-canvas-container');
    if (sidebarContainer) {
      initSidebarCharacter(sidebarContainer);
      updateSidebarCharacterColor(selectedColor);
    }
    
    // Trigger window resize events to size the canvas container properly on mobile
    // Multiple staggered dispatches ensure CSS layout has settled
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  // 1. Color Customizer Swatches Click Events
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      
      const colorKey = swatch.dataset.color;
      selectedColor = SPORKY_COLORS[colorKey] || '#06b6d4';
      
      updateUIColor(selectedColor);
      setPlayerColor(selectedColor);
      setClimberColor(selectedColor);
      setWelcomeSporkyColor(selectedColor);
      updateSidebarCharacterColor(selectedColor);
    });
  });

  // 2. Navigation: Enter Game Tab Click (Enter Sporky Land)
  if (btnEnterGame) {
    btnEnterGame.addEventListener('click', () => {
      // Quick transition to Map Screen
      setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        mapScreen.classList.remove('hidden');
        // Keep URL at root when on map
        history.replaceState({ screen: 'map' }, '', '/');
        trackScreenChange('map');
      }, 150); // small delay to let the click animation play out
    });
  }

  // 3. Navigation: Map -> Welcome (Back)
  if (btnBackToWelcome) {
    btnBackToWelcome.addEventListener('click', () => {
      mapScreen.classList.add('hidden');
      welcomeScreen.classList.remove('hidden');
      // Update URL to root
      history.replaceState({ screen: 'welcome' }, '', '/');
      trackScreenChange('welcome');
      // Re-trigger the welcome Sporky renderer resize so it appears correctly
      resumeWelcomeSporky();
    });
  }

  // 4. Navigation: Game -> Map (Exit Game)
  if (btnBackToMap) {
    btnBackToMap.addEventListener('click', () => {
      gameScreen.classList.add('hidden');
      mapScreen.classList.remove('hidden');
      // Update URL back to root when leaving the slopes exercise
      history.replaceState({ screen: 'map' }, '', '/');
      trackScreenChange('map');
      
      // Stop sidebar character preview to conserve resources
      stopSidebarCharacter();
      
      // Update solved count badge displays on map screen cards if needed
      // (The map region cards are locked except Himalayan Slopes, but this is good futureproofing)
    });
  }

  // 5. Open Customizer Modal from Map
  if (btnOpenCustomizer) {
    btnOpenCustomizer.addEventListener('click', () => {
      if (customizerModal) {
        customizerModal.classList.remove('hidden');
      }
    });
  }

  // 6. Close Customizer Modal ("Start Exploring" button)
  if (btnCloseCustomizer) {
    btnCloseCustomizer.addEventListener('click', () => {
      if (customizerModal) {
        customizerModal.classList.add('hidden');
      }
    });
  }

  // 7. Map Regions Clicks
  mapRegions.forEach(card => {
    card.addEventListener('click', () => {
      const isPlayable = card.classList.contains('playable');
      
      if (isPlayable) {
        // Go to Himalayan Slopes (Mount Zaina) game screen
        mapScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        // Update URL to /slopes when entering the exercise
        history.replaceState({ screen: 'game' }, '', '/slopes');
        trackScreenChange('game');
        trackLevelChange(0);
        
        // Update Three.js Sporky color
        setClimberColor(selectedColor);
        
        // Initialize sidebar character preview
        const sidebarContainer = document.getElementById('sidebar-character-canvas-container');
        if (sidebarContainer) {
          initSidebarCharacter(sidebarContainer);
          updateSidebarCharacterColor(selectedColor);
        }
        
        // Trigger window resize events to size the canvas container properly on mobile
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 50);
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 200);
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 500);
      } else {
        // Show Locked Region Modal
        const regionName = card.querySelector('.region-name').textContent;
        const regionDesc = card.dataset.desc;
        const regionEmoji = card.querySelector('.region-icon').textContent;
        
        if (modalTitle && modalDesc && modalEmoji && modalOverlay) {
          modalTitle.textContent = regionName;
          modalDesc.innerHTML = regionDesc;
          modalEmoji.textContent = regionEmoji;
          modalOverlay.classList.remove('hidden');
        }
      }
    });
  });

  // 8. Locked Modal Close handlers
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.add('hidden');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
      }
    });
  }

  if (customizerModal) {
    customizerModal.addEventListener('click', (e) => {
      if (e.target === customizerModal) {
        customizerModal.classList.add('hidden');
      }
    });
  }

  // --- USER AUTHENTICATION HANDLERS ---

  // Open Auth Modal
  if (btnWelcomeSignin) {
    btnWelcomeSignin.addEventListener('click', () => {
      if (authModal) {
        authFeedback.classList.add('hidden');
        authModal.classList.remove('hidden');
        switchAuthTab('signin');
      }
    });
  }

  // Close Auth Modal
  if (authCloseBtn) {
    authCloseBtn.addEventListener('click', () => {
      authModal.classList.add('hidden');
    });
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        authModal.classList.add('hidden');
      }
    });
  }

  // Toggle Tabs
  function switchAuthTab(tab) {
    activeAuthTab = tab;
    if (tab === 'signin') {
      tabSignin.classList.add('active');
      tabSignup.classList.remove('active');
      authModalTitle.textContent = 'Sign In';
      btnAuthSubmit.textContent = 'Sign In 🚀';
      btnForgotPassword.style.display = 'inline-block';
    } else {
      tabSignup.classList.add('active');
      tabSignin.classList.remove('active');
      authModalTitle.textContent = 'Create Account';
      btnAuthSubmit.textContent = 'Sign Up & Start! 🎉';
      btnForgotPassword.style.display = 'none';
    }
  }

  if (tabSignin) {
    tabSignin.addEventListener('click', () => switchAuthTab('signin'));
  }
  if (tabSignup) {
    tabSignup.addEventListener('click', () => switchAuthTab('signup'));
  }

  // Form Submission
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authFeedback.classList.add('hidden');
      btnAuthSubmit.disabled = true;
      btnAuthSubmit.textContent = 'Processing... ⚙️';

      const email = authEmailInput.value;
      const password = authPasswordInput.value;

      try {
        if (activeAuthTab === 'signin') {
          // Sign In
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          
          // Successful login
          authModal.classList.add('hidden');
          authForm.reset();
        } else {
          // Sign Up
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;

          // Successful signup
          authFeedback.style.backgroundColor = '#f0fdf4';
          authFeedback.style.borderColor = '#10b981';
          authFeedback.style.color = '#15803d';
          authFeedback.textContent = 'Success! Check your email for the confirmation link.';
          authFeedback.classList.remove('hidden');
          authForm.reset();
        }
      } catch (err) {
        authFeedback.style.backgroundColor = '#fef2f2';
        authFeedback.style.borderColor = '#ef4444';
        authFeedback.style.color = '#b91c1c';
        authFeedback.textContent = err.message || 'An error occurred. Please try again.';
        authFeedback.classList.remove('hidden');
      } finally {
        btnAuthSubmit.disabled = false;
        btnAuthSubmit.textContent = activeAuthTab === 'signin' ? 'Sign In 🚀' : 'Sign Up & Start! 🎉';
      }
    });
  }

  // Forgot Password
  if (btnForgotPassword) {
    btnForgotPassword.addEventListener('click', async () => {
      const email = authEmailInput.value;
      if (!email) {
        authFeedback.style.backgroundColor = '#fef2f2';
        authFeedback.style.borderColor = '#ef4444';
        authFeedback.style.color = '#b91c1c';
        authFeedback.textContent = 'Please enter your email address first.';
        authFeedback.classList.remove('hidden');
        return;
      }

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
        if (error) throw error;

        authFeedback.style.backgroundColor = '#f0fdf4';
        authFeedback.style.borderColor = '#10b981';
        authFeedback.style.color = '#15803d';
        authFeedback.textContent = 'Password reset email sent! Check your inbox.';
        authFeedback.classList.remove('hidden');
      } catch (err) {
        authFeedback.style.backgroundColor = '#fef2f2';
        authFeedback.style.borderColor = '#ef4444';
        authFeedback.style.color = '#b91c1c';
        authFeedback.textContent = err.message || 'Failed to send reset email.';
        authFeedback.classList.remove('hidden');
      }
    });
  }

  // Monitor Auth State and Update UI
  supabase.auth.onAuthStateChange(async (event, session) => {
    const authHeaderControls = document.getElementById('map-auth-controls');
    
    // Add/remove controls container in Map Header if it doesn't exist
    let mapHeaderControls = document.querySelector('.map-header-controls');
    if (!mapHeaderControls) return;

    // Remove existing auth display
    let oldAuthDisplay = document.getElementById('map-auth-display');
    if (oldAuthDisplay) {
      oldAuthDisplay.remove();
    }

    const authDisplay = document.createElement('div');
    authDisplay.id = 'map-auth-display';
    authDisplay.style.display = 'flex';
    authDisplay.style.alignItems = 'center';
    authDisplay.style.gap = '10px';

    if (session && session.user) {
      // User is logged in
      const email = session.user.email;
      
      // Sync local progress (if any) to cloud
      await syncGuestProgressToAccount();
      
      // Load progress
      await refreshProgressUI();

      // Display Logged In UI
      authDisplay.innerHTML = `
        <span class="user-email-badge" style="font-size: 0.9rem; font-weight: 700; color: var(--color-secondary); background: #f1f5f9; border: 2.5px solid var(--color-border); padding: 4px 10px; border-radius: 8px;">
          👤 ${email}
        </span>
        <button id="btn-signout" class="btn btn-secondary" style="font-size: 0.85rem; padding: 4px 8px; box-shadow: 2px 2px 0px var(--color-btn-shadow);">
          Log Out
        </button>
      `;

      // Insert at the beginning of controls
      mapHeaderControls.insertBefore(authDisplay, mapHeaderControls.firstChild);

      // Sign Out Button listener
      const btnSignout = document.getElementById('btn-signout');
      if (btnSignout) {
        btnSignout.addEventListener('click', async () => {
          await supabase.auth.signOut();
          localStorage.removeItem('sporky_solved_counts');
          localStorage.removeItem('sporky_color');
          window.location.reload(); // Reload to reset all states
        });
      }
      
      // Hide sign-in link on welcome page
      if (btnWelcomeSignin) {
        btnWelcomeSignin.style.display = 'none';
      }
    } else {
      // User is a guest
      authDisplay.innerHTML = `
        <button id="btn-map-signin" class="btn btn-secondary" style="font-size: 0.85rem; padding: 4px 10px; font-weight: 700;">
          Save Progress / Sign In 👤
        </button>
      `;
      mapHeaderControls.insertBefore(authDisplay, mapHeaderControls.firstChild);

      const btnMapSignin = document.getElementById('btn-map-signin');
      if (btnMapSignin) {
        btnMapSignin.addEventListener('click', () => {
          authFeedback.classList.add('hidden');
          authModal.classList.remove('hidden');
          switchAuthTab('signin');
        });
      }

      if (btnWelcomeSignin) {
        btnWelcomeSignin.style.display = 'inline-block';
      }
    }
  });
}
