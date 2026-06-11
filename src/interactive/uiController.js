// Controller for the HTML UI Overlays and HUD inputs
import { changeLevel, resetLevel, getGameState, submitSlopePosition, submitLevel3Slope, testRoute, shuffleTargetCoordinate, placePegLvl4 } from '../levels/gameManager.js';
import { levels } from '../levels/levelData.js';
import { getLocalSolvedCount, getCoins, purchaseOutfit, equipOutfit, unequipOutfit, getPurchasedOutfits, getActiveOutfits, getStreak } from '../lib/progressManager.js';
import { OUTFITS_DATA } from '../engine/outfits.js';
import { trackLevelChange } from '../lib/sessionTracker.js';
import { playPurchaseSound } from '../engine/audio.js';
import { updateSidebarCharacterOutfit, initSidebarCharacter, stopSidebarCharacter } from '../engine/sidebarCharacter.js';
import { updateClimberOutfit, getClimberHovering } from '../engine/climber.js';
import { updateWelcomeSporkyOutfit } from '../engine/welcomeSporky.js';
import { getHolds, getCoordinateOffset } from '../engine/wall.js';

// DOM Element Cache
let elements = {};
let activeShopTab = 'buy';
let activeCategory = null;

const CATEGORY_MAP = {
  hats: {
    name: 'Hats',
    emoji: '❄️',
    slots: ['hat']
  },
  jackets: {
    name: 'Jackets',
    emoji: '🧥',
    slots: ['coat', 'scarf']
  },
  gloves: {
    name: 'Gloves',
    emoji: '🧤',
    slots: ['mittens']
  },
  eyewear: {
    name: 'Eye wear',
    emoji: '🥽',
    slots: ['goggles']
  }
};

export function initUI() {
  elements = {
    levelIndicator: document.getElementById('level-indicator'),
    progressBeads: document.getElementById('progress-beads-container'),
    solvedBadge: document.getElementById('solved-badge'),
    controlPanel: document.getElementById('control-panel'),
    challengeTitle: document.getElementById('challenge-title'),
    challengeDesc: document.getElementById('challenge-desc'),
    currentCoordTag: document.getElementById('current-climber-coord'),
    currentCoordText: document.getElementById('current-coord-text'),
    
    // Panels
    panelLvl1: document.getElementById('controls-level-1'),
    panelLvl2: document.getElementById('controls-level-2'),
    panelLvl3: document.getElementById('controls-level-3'),
    panelLvl4: document.getElementById('controls-level-4'),
    panelLvl5: document.getElementById('controls-level-5'),
    
    // Level 1 Inputs
    badgeX: document.getElementById('badge-x-val'),
    badgeY: document.getElementById('badge-y-val'),
    btnTryAnother: document.getElementById('btn-try-another'),
    
    // Level 2 Inputs
    btnResetSlope: document.getElementById('btn-reset-slope'),
    btnSubmitSlope: document.getElementById('btn-submit-slope'),
    targetSlopeDisplay: document.getElementById('target-slope-display'),
    badgeXLvl2: document.getElementById('badge-x-val-lvl2'),
    badgeYLvl2: document.getElementById('badge-y-val-lvl2'),

    // Level 3 Inputs
    inputRiseLvl3: document.getElementById('input-rise-lvl3'),
    inputRunLvl3: document.getElementById('input-run-lvl3'),
    btnResetSlopeLvl3: document.getElementById('btn-reset-slope-lvl3'),
    btnSubmitSlopeLvl3: document.getElementById('btn-submit-slope-lvl3'),
    btnSubmitSlopeCard: document.getElementById('btn-submit-slope-card'),
    badgeXLvl3: document.getElementById('badge-x-val-lvl3'),
    badgeYLvl3: document.getElementById('badge-y-val-lvl3'),
    
    // Level 4 Inputs
    btnResetLvl4: document.getElementById('btn-reset-lvl4'),
    btnPlacePegLvl4: document.getElementById('btn-place-peg-lvl4'),
    badgeXLvl4: document.getElementById('badge-x-val-lvl4'),
    badgeYLvl4: document.getElementById('badge-y-val-lvl4'),
    targetEqMDisplay: document.getElementById('target-eq-m-display'),
    targetEqBDisplay: document.getElementById('target-eq-b-display'),
    
    // Level 5 Inputs
    sliderM: document.getElementById('slider-m'),
    sliderB: document.getElementById('slider-b'),
    sliderMVal: document.getElementById('slider-m-val'),
    sliderBVal: document.getElementById('slider-b-val'),
    formulaM: document.getElementById('formula-m'),
    formulaB: document.getElementById('formula-b'),
    btnClimbIntercept: document.getElementById('btn-climb-intercept'),
    btnResetIntercept: document.getElementById('btn-reset-intercept'),
    
    // Toast & Footer Nav
    toast: document.getElementById('toast-banner'),
    toastMessage: document.getElementById('toast-message'),
    btnPrev: document.getElementById('btn-prev-level'),
    btnNext: document.getElementById('btn-next-level'),

    // Coin & Shop Elements
    mapCoinsVal: document.getElementById('map-coins-val'),
    gameCoinsVal: document.getElementById('game-coins-val'),
    shopCoinsVal: document.getElementById('shop-coins-val'),
    btnOpenShop: document.getElementById('btn-open-shop'),
    btnOpenShopMobile: document.getElementById('btn-open-shop-mobile'),
    outfitShopModal: document.getElementById('outfit-shop-modal'),
    shopCloseBtn: document.getElementById('shop-close-btn'),
    shopOutfitsGrid: document.getElementById('shop-outfits-grid'),
    mapCoinCounter: document.getElementById('map-coin-counter'),
    gameCoinCounter: document.getElementById('game-coin-counter')
  };

  bindEvents();
}

function bindEvents() {
  // Global buttons
  elements.btnPrev.addEventListener('click', () => {
    hideToast();
    changeLevel(-1);
    const state = getGameState();
    trackLevelChange(state.levelIndex);
  });
  elements.btnNext.addEventListener('click', () => {
    hideToast();
    changeLevel(1);
    const state = getGameState();
    trackLevelChange(state.levelIndex);
  });

  // Level 1 - Try another coordinate
  if (elements.btnTryAnother) {
    elements.btnTryAnother.addEventListener('click', () => {
      hideToast();
      shuffleTargetCoordinate();
    });
  }

  // Level 2 - local Reset & Submit
  if (elements.btnResetSlope) {
    elements.btnResetSlope.addEventListener('click', () => {
      hideToast();
      resetLevel();
    });
  }
  if (elements.btnSubmitSlope) {
    elements.btnSubmitSlope.addEventListener('click', () => {
      hideToast();
      submitSlopePosition();
    });
  }

  // Level 3 - local Reset & Submit Slope
  if (elements.btnResetSlopeLvl3) {
    elements.btnResetSlopeLvl3.addEventListener('click', () => {
      hideToast();
      resetLevel();
    });
  }
  if (elements.btnSubmitSlopeLvl3) {
    elements.btnSubmitSlopeLvl3.addEventListener('click', () => {
      hideToast();
      submitLevel3Slope();
    });
  }
  if (elements.btnSubmitSlopeCard) {
    elements.btnSubmitSlopeCard.addEventListener('click', () => {
      hideToast();
      submitLevel3Slope();
    });
  }
  if (elements.challengeDesc) {
    elements.challengeDesc.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (e.target && (e.target.id === 'input-rise-lvl3' || e.target.id === 'input-run-lvl3')) {
          e.preventDefault();
          hideToast();
          submitLevel3Slope();
        }
      }
    });
  }

  // Level 4 - local Reset & Place Peg
  if (elements.btnResetLvl4) {
    elements.btnResetLvl4.addEventListener('click', () => {
      hideToast();
      resetLevel();
    });
  }
  if (elements.btnPlacePegLvl4) {
    elements.btnPlacePegLvl4.addEventListener('click', () => {
      hideToast();
      placePegLvl4();
    });
  }

  // Level 5 - Sliders & local Reset
  elements.sliderM.addEventListener('input', (e) => {
    const m = parseFloat(e.target.value);
    elements.sliderMVal.textContent = m > 0 ? `+${m.toFixed(2)}` : m.toFixed(2);
    elements.formulaM.textContent = m === 1 ? '' : m === -1 ? '-' : m.toFixed(2);
    onSliderChange();
  });
  elements.sliderB.addEventListener('input', (e) => {
    const b = parseInt(e.target.value, 10);
    elements.sliderBVal.textContent = b >= 0 ? `+${b}` : b;
    elements.formulaB.textContent = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    onSliderChange();
  });
  elements.btnClimbIntercept.addEventListener('click', () => {
    hideToast();
    testRoute();
  });
  if (elements.btnResetIntercept) {
    elements.btnResetIntercept.addEventListener('click', () => {
      hideToast();
      resetLevel();
    });
  }

  // Shop events
  const openShopFn = () => {
    activeShopTab = 'buy';
    activeCategory = null;
    const tabB = document.getElementById('tab-shop-buy');
    const tabC = document.getElementById('tab-shop-closet');
    if (tabB && tabC) {
      tabB.classList.add('active');
      tabC.classList.remove('active');
    }
    elements.outfitShopModal.classList.remove('hidden');

    const shopPreviewContainer = document.getElementById('shop-character-canvas-container');
    if (shopPreviewContainer) {
      initSidebarCharacter(shopPreviewContainer);
    }

    renderShopGrid();
    updateCoinDisplays();
  };

  const closeShopFn = () => {
    elements.outfitShopModal.classList.add('hidden');
    const shopPreviewContainer = document.getElementById('shop-character-canvas-container');
    if (shopPreviewContainer) {
      stopSidebarCharacter(shopPreviewContainer);
    }
  };

  if (elements.btnOpenShop) {
    elements.btnOpenShop.addEventListener('click', openShopFn);
  }
  if (elements.btnOpenShopMobile) {
    elements.btnOpenShopMobile.addEventListener('click', openShopFn);
  }
  if (elements.shopCloseBtn) {
    elements.shopCloseBtn.addEventListener('click', closeShopFn);
  }
  if (elements.outfitShopModal) {
    elements.outfitShopModal.addEventListener('click', (e) => {
      if (e.target === elements.outfitShopModal) {
        closeShopFn();
      }
    });
  }

  // Shop tabs click events
  const tabBuy = document.getElementById('tab-shop-buy');
  const tabCloset = document.getElementById('tab-shop-closet');
  if (tabBuy && tabCloset) {
    tabBuy.addEventListener('click', () => {
      activeShopTab = 'buy';
      activeCategory = null;
      tabBuy.classList.add('active');
      tabCloset.classList.remove('active');
      renderShopGrid();
    });
    tabCloset.addEventListener('click', () => {
      activeShopTab = 'closet';
      activeCategory = null;
      tabCloset.classList.add('active');
      tabBuy.classList.remove('active');
      renderShopGrid();
    });
  }

}

let equationChangeCallback = null;
export function setOnEquationChange(callback) {
  equationChangeCallback = callback;
}
function onSliderChange() {
  if (equationChangeCallback) {
    const m = parseFloat(elements.sliderM.value);
    const b = parseInt(elements.sliderB.value, 10);
    equationChangeCallback(m, b);
  }
}

// Character selection removed

// Public Methods
export function updateSolvedCount(levelIndex) {
  if (elements.solvedBadge) {
    elements.solvedBadge.textContent = `Solved: ${getLocalSolvedCount(levelIndex)}`;
  }
}

export function showLevelUI(levelId, title, desc, instruction, showGridLines) {
  // Sync coin and streak displays
  updateCoinDisplays();
  updateStreakDisplay(getStreak());

  // Update Header details
  elements.levelIndicator.textContent = `Challenge ${levelId} of ${levels.length}`;
  elements.challengeTitle.textContent = title;
  elements.challengeDesc.innerHTML = desc;

  // Update solved badge
  updateSolvedCount(levelId - 1);
  
  // Update beads if container exists
  if (elements.progressBeads) {
    const beads = elements.progressBeads.children;
    for (let i = 0; i < beads.length; i++) {
      beads[i].className = 'bead';
      if (i < levelId - 1) beads[i].classList.add('completed');
      if (i === levelId - 1) beads[i].classList.add('active');
    }
  }

  // Toggle control panels
  elements.panelLvl1.classList.add('hidden');
  elements.panelLvl2.classList.add('hidden');
  elements.panelLvl3.classList.add('hidden');
  elements.panelLvl4.classList.add('hidden');
  if (elements.panelLvl5) elements.panelLvl5.classList.add('hidden');
  elements.currentCoordTag.classList.add('hidden');
  if (elements.btnSubmitSlopeCard) elements.btnSubmitSlopeCard.classList.add('hidden');
  if (elements.btnResetLvl4) elements.btnResetLvl4.classList.add('hidden');
  if (elements.btnPlacePegLvl4) elements.btnPlacePegLvl4.classList.add('hidden');

  // Toggle Level 1 "Try another problem" button inside challenge card
  if (levelId === 1) {
    if (elements.btnTryAnother) elements.btnTryAnother.classList.remove('hidden');
  } else {
    if (elements.btnTryAnother) elements.btnTryAnother.classList.add('hidden');
  }

  // Toggle outer control panel card visibility (hidden entirely for Level 1, Level 2, Level 3, Level 4, and Level 5)
  if (elements.controlPanel) {
    if (levelId === 1 || levelId === 2 || levelId === 3 || levelId === 4 || levelId === 5) {
      elements.controlPanel.classList.add('hidden');
    } else {
      elements.controlPanel.classList.remove('hidden');
    }
  }

  if (levelId === 1) {
    elements.panelLvl1.classList.remove('hidden');
    elements.currentCoordTag.classList.remove('hidden');
  } else if (levelId === 2) {
    elements.panelLvl2.classList.remove('hidden');
    elements.currentCoordTag.classList.remove('hidden');
  } else if (levelId === 3) {
    elements.panelLvl3.classList.remove('hidden');
    if (elements.btnSubmitSlopeCard) elements.btnSubmitSlopeCard.classList.remove('hidden');
    const inputRise = document.getElementById('input-rise-lvl3');
    const inputRun = document.getElementById('input-run-lvl3');
    if (inputRise) inputRise.value = '';
    if (inputRun) inputRun.value = '';
  } else if (levelId === 4) {
    elements.currentCoordTag.classList.remove('hidden');
    if (elements.btnResetLvl4) elements.btnResetLvl4.classList.remove('hidden');
    if (elements.btnPlacePegLvl4) elements.btnPlacePegLvl4.classList.remove('hidden');
  } else if (levelId === 6) {
    if (elements.panelLvl5) elements.panelLvl5.classList.remove('hidden');
    // Reset sliders visual
    elements.sliderM.value = '1.0';
    elements.sliderB.value = '0';
    elements.sliderMVal.textContent = '+1.00';
    elements.sliderBVal.textContent = '+0';
    elements.formulaM.textContent = '';
    elements.formulaB.textContent = '+ 0';
  }

  // Next/Prev footer button disabled states
  elements.btnPrev.disabled = (levelId === 1);
  elements.btnNext.disabled = (levelId === levels.length);
}

export function updateCoordinatesDisplay(x, y) {
  let displayX = '?';
  let displayY = '?';
  
  const isHovering = getClimberHovering && getClimberHovering();
  
  if (isHovering) {
    const holds = getHolds();
    let minDist = 0.60;
    let nearest = null;
    holds.forEach(hold => {
      const offset = getCoordinateOffset(hold.userData.x, hold.userData.y);
      const hx = hold.userData.x + offset.x;
      const hy = hold.userData.y + offset.y;
      const d = Math.sqrt((x - hx) ** 2 + (y - hy) ** 2);
      if (d < minDist) {
        minDist = d;
        nearest = hold;
      }
    });
    if (nearest) {
      displayX = nearest.userData.x;
      displayY = nearest.userData.y;
    }
  } else {
    displayX = Math.round(x);
    displayY = Math.round(y);
  }
  
  if (elements.badgeX) {
    elements.badgeX.textContent = displayX;
    elements.badgeY.textContent = displayY;
  }
  if (elements.badgeXLvl2) {
    elements.badgeXLvl2.textContent = displayX;
    elements.badgeYLvl2.textContent = displayY;
  }
  if (elements.badgeXLvl3) {
    elements.badgeXLvl3.textContent = displayX;
    elements.badgeYLvl3.textContent = displayY;
  }
  if (elements.badgeXLvl4) {
    elements.badgeXLvl4.textContent = displayX;
    elements.badgeYLvl4.textContent = displayY;
  }
  if (elements.currentCoordText) {
    elements.currentCoordText.textContent = `(${displayX}, ${displayY})`;
  }
}

export function setNextButtonUnlocked(unlocked) {
  const match = elements.levelIndicator.textContent.match(/\d+/);
  const currentLvlId = match ? parseInt(match[0], 10) : 1;
  elements.btnNext.disabled = (currentLvlId === levels.length);
}

export function updateStreakDisplay(streak) {
  const streakCounter = document.getElementById('game-streak-counter');
  const streakVal = document.getElementById('game-streak-val');
  if (streakCounter && streakVal) {
    if (streak > 0) {
      streakVal.textContent = streak;
      streakCounter.classList.remove('hidden');
    } else {
      streakCounter.classList.add('hidden');
    }
  }
}

// Toast System
let toastTimeout;
export function showToast(message, isError = false, duration = 3500) {
  clearTimeout(toastTimeout);
  
  elements.toastMessage.innerHTML = message;
  elements.toast.className = 'toast';
  
  if (isError) {
    elements.toast.classList.add('error');
    elements.toast.querySelector('.toast-emoji').textContent = '⚠️';
  } else {
    elements.toast.querySelector('.toast-emoji').textContent = '🎉';
  }
  
  elements.toast.classList.remove('hidden');

  if (duration > 0) {
    toastTimeout = setTimeout(hideToast, duration);
  }
}

export function hideToast() {
  elements.toast.classList.add('hidden');
}

export function setTargetSlopeDisplay(rise, run) {
  if (elements.targetSlopeDisplay) {
    const riseSign = rise < 0 ? '<span style="color: #ef4444;">-</span>' : '';
    const riseNum = `<span style="color: #000000;">${Math.abs(rise)}</span>`;
    const runSign = run < 0 ? '<span style="color: #ef4444;">-</span>' : '';
    const runNum = `<span style="color: #000000;">${Math.abs(run)}</span>`;
    elements.targetSlopeDisplay.innerHTML = `${riseSign}${riseNum} / ${runSign}${runNum}`;
  }
}

export function getLevel3Inputs() {
  return {
    m: parseFloat(elements.sliderM.value),
    b: parseInt(elements.sliderB.value, 10)
  };
}

export function setTargetEquationLvl4(rise, run, b) {
  // Format equation: y = mx + b (clean, no inline hints)
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const divisor = Math.abs(gcd(rise, run));
  const simplifiedRise = rise / divisor;
  const simplifiedRun = run / divisor;

  let mStr = "";
  if (simplifiedRise === 1 && simplifiedRun === 1) {
    mStr = "";
  } else if (simplifiedRise === -1 && simplifiedRun === 1) {
    mStr = "-";
  } else if (simplifiedRun === 1) {
    mStr = simplifiedRise.toString();
  } else {
    if (simplifiedRise < 0) {
      mStr = `-${Math.abs(simplifiedRise)}/${simplifiedRun}`;
    } else {
      mStr = `${simplifiedRise}/${simplifiedRun}`;
    }
  }

  let bStr = "";
  if (b > 0) {
    bStr = `+ ${b}`;
  } else if (b < 0) {
    bStr = `- ${Math.abs(b)}`;
  } else {
    bStr = `+ 0`;
  }

  if (elements.targetEqMDisplay) {
    elements.targetEqMDisplay.textContent = mStr;
  }
  if (elements.targetEqBDisplay) {
    elements.targetEqBDisplay.textContent = bStr;
  }

  // Populate the separate slope hint below the equation
  const hintEl = document.getElementById('slope-hint-lvl4');
  if (hintEl) {
    const riseSign = simplifiedRise < 0 ? '<span style="color: #ef4444;">-</span>' : '';
    const riseNum = `<span style="color: #000000;">${Math.abs(simplifiedRise)}</span>`;
    const runSign = simplifiedRun < 0 ? '<span style="color: #ef4444;">-</span>' : '';
    const runNum = `<span style="color: #000000;">${Math.abs(simplifiedRun)}</span>`;
    hintEl.innerHTML = `💡 Slope = <span style="font-weight:700;"><sup>${riseSign}${riseNum}</sup>&frasl;<sub>${runSign}${runNum}</sub></span> <span style="opacity:0.7;">(<span style="color: #ca8a04; font-weight: 700;">up</span>/<span style="color: #ef4444; font-weight: 700;">down</span> &frasl; <span style="color: #ef4444; font-weight: 700;">left</span>/<span style="color: #16a34a; font-weight: 700;">right</span>)</span>`;
  }
}

// --- Gamification Coin Sync & Shop Helpers ---

export function updateCoinDisplays() {
  const coins = getCoins();
  if (elements.mapCoinsVal) elements.mapCoinsVal.textContent = coins;
  if (elements.gameCoinsVal) elements.gameCoinsVal.textContent = coins;
  if (elements.shopCoinsVal) elements.shopCoinsVal.textContent = coins;
}

export function triggerFlyingCoinAnimation(startElement = null) {
  const sourceEl = startElement || elements.solvedBadge;
  if (!sourceEl) {
    updateCoinDisplays();
    return;
  }

  const gameScreen = document.getElementById('game-screen');
  const isGameVisible = gameScreen && !gameScreen.classList.contains('hidden');
  const targetCounter = isGameVisible ? elements.gameCoinCounter : elements.mapCoinCounter;

  if (!targetCounter) {
    updateCoinDisplays();
    return;
  }

  // Create flying coin element
  const coin = document.createElement('div');
  coin.className = 'flying-coin';
  coin.textContent = '🪙';
  document.body.appendChild(coin);

  const startRect = sourceEl.getBoundingClientRect();
  const targetRect = targetCounter.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;
  coin.style.left = `${startX}px`;
  coin.style.top = `${startY}px`;

  requestAnimationFrame(() => {
    setTimeout(() => {
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;
      coin.style.left = `${targetX}px`;
      coin.style.top = `${targetY}px`;
      coin.style.transform = 'translate(-50%, -50%) scale(1.3)';
    }, 50);
  });

  setTimeout(() => {
    coin.remove();
    updateCoinDisplays();

    // Play coin collect chime
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, actx.currentTime); // C6 ping
      gain.gain.setValueAtTime(0.04, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.15);
    } catch (e) {}

    targetCounter.classList.add('pulse-animation');
    setTimeout(() => {
      targetCounter.classList.remove('pulse-animation');
    }, 400);
  }, 800);
}

export function renderShopGrid() {
  if (!elements.shopOutfitsGrid) return;

  if (!activeCategory) {
    elements.shopOutfitsGrid.className = 'shop-grid category-view';
    elements.shopOutfitsGrid.innerHTML = '';
    Object.entries(CATEGORY_MAP).forEach(([key, cat]) => {
      const card = document.createElement('div');
      card.className = 'outfit-card category-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="outfit-emoji">${cat.emoji}</div>
        <div class="outfit-name" style="font-size: 1.25rem; margin-top: 10px;">${cat.name}</div>
      `;
      card.addEventListener('click', () => {
        activeCategory = key;
        renderShopGrid();
      });
      elements.shopOutfitsGrid.appendChild(card);
    });
    return;
  }

  elements.shopOutfitsGrid.className = 'shop-grid item-view';
  elements.shopOutfitsGrid.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-secondary';
  backBtn.style.gridColumn = '1 / -1';
  backBtn.style.marginBottom = '10px';
  backBtn.style.justifyContent = 'center';
  backBtn.innerHTML = '← Back to Categories';
  backBtn.addEventListener('click', () => {
    activeCategory = null;
    renderShopGrid();
  });
  elements.shopOutfitsGrid.appendChild(backBtn);

  const coins = getCoins();
  const purchased = getPurchasedOutfits();
  const activeOutfits = getActiveOutfits();

  let displayedCount = 0;

  const allowedSlots = CATEGORY_MAP[activeCategory].slots;

  // Filter outfits for the current category and tab
  const categoryOutfits = Object.values(OUTFITS_DATA).filter((outfit) => {
    const isPurchased = purchased.includes(outfit.id);

    // Closet tab: only show owned items
    if (activeShopTab === 'closet' && !isPurchased) {
      return false;
    }

    // Buy tab: only show winter outfits for Mount Zaina
    if (activeShopTab === 'buy' && outfit.shop !== 'zaina') {
      return false;
    }

    // Filter by active category's slots
    if (!allowedSlots.includes(outfit.slot)) {
      return false;
    }

    return true;
  });

  // Sort: first by the index of its slot in allowedSlots, then by price
  categoryOutfits.sort((a, b) => {
    const slotIdxA = allowedSlots.indexOf(a.slot);
    const slotIdxB = allowedSlots.indexOf(b.slot);
    if (slotIdxA !== slotIdxB) {
      return slotIdxA - slotIdxB;
    }
    return a.price - b.price;
  });

  categoryOutfits.forEach((outfit) => {
    const isPurchased = purchased.includes(outfit.id);
    const isActive = activeOutfits.includes(outfit.id);

    displayedCount++;

    const card = document.createElement('div');
    card.className = 'outfit-card';

    let priceBadge = '';
    if (!isPurchased) {
      priceBadge = `<div class="outfit-price">💰 ${outfit.price} Coins</div>`;
    }

    card.innerHTML = `
      <div class="outfit-emoji">${outfit.emoji}</div>
      <div class="outfit-name">${outfit.name}</div>
      <div class="outfit-desc">${outfit.description}</div>
      ${priceBadge}
    `;

    const btn = document.createElement('button');
    btn.className = 'btn outfit-btn';
    
    if (isActive) {
      btn.textContent = 'Take off';
      btn.classList.add('equipped');
    } else if (isPurchased) {
      btn.textContent = 'Wear';
      btn.classList.add('owned');
    } else {
      btn.textContent = 'Buy';
      btn.classList.add('btn-primary');
      if (coins < outfit.price) {
        btn.disabled = true;
      }
    }

    btn.addEventListener('click', () => {
      if (isActive) {
        unequipOutfit(outfit.id);
      } else if (isPurchased) {
        equipOutfit(outfit.id);
      } else if (purchaseOutfit(outfit.id, outfit.price)) {
        playPurchaseSound();
        equipOutfit(outfit.id);
      } else {
        return;
      }
      updateOutfitEverywhere();
      renderShopGrid();
      updateCoinDisplays();
    });

    card.appendChild(btn);
    elements.shopOutfitsGrid.appendChild(card);
  });

  if (activeShopTab === 'closet' && displayedCount === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'closet-empty-state';
    emptyState.innerHTML = `
      <div class="closet-empty-emoji">🚪</div>
      <div class="closet-empty-text">Your closet is empty!</div>
      <div class="closet-empty-subtext">Head to the shop tab to purchase outfits for Sporky!</div>
    `;
    elements.shopOutfitsGrid.appendChild(emptyState);
  }
}

function updateOutfitEverywhere() {
  const outfitIds = getActiveOutfits();
  updateSidebarCharacterOutfit(outfitIds);
  updateClimberOutfit(outfitIds);
  updateWelcomeSporkyOutfit(outfitIds);
}
