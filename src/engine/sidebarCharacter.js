import { getPlayerColor, getActiveOutfits } from '../lib/progressManager.js';
import { OUTFITS_DATA, getOutfitSVG } from './outfits.js';

let containerElement = null;
let activeOutfitIds = [];
let activeColor = '#06b6d4';

/**
 * Generates a hex code for a darker shade of the player's color
 */
function getDarkerColor(hex) {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  const darken = (c) => Math.max(0, Math.floor(c * 0.72));
  const dr = darken(r).toString(16).padStart(2, '0');
  const dg = darken(g).toString(16).padStart(2, '0');
  const db = darken(b).toString(16).padStart(2, '0');
  
  return `#${dr}${dg}${db}`;
}

/**
 * Renders the static 2D SVG character inside the container
 */
function render2DSporky() {
  if (!containerElement) return;

  const color = activeColor;
  const darkColor = getDarkerColor(color);

  // Sort worn items by layer; negative layers render behind Sporky
  const wornIds = activeOutfitIds
    .filter((id) => OUTFITS_DATA[id])
    .sort((a, b) => (OUTFITS_DATA[a].layer || 0) - (OUTFITS_DATA[b].layer || 0));
  const backIds = wornIds.filter((id) => (OUTFITS_DATA[id].layer || 0) < 0);
  const frontIds = wornIds.filter((id) => (OUTFITS_DATA[id].layer || 0) >= 0);

  // Base Sporky SVG Structure
  let svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" class="sporky-svg" style="width: 100%; height: 100%;">
      <defs>
        <!-- Radial Gradient for papercraft 3D volume in 2D -->
        <radialGradient id="body-gradient" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${color}" />
          <stop offset="100%" stop-color="${darkColor}" />
        </radialGradient>
      </defs>
  `;

  // 0. Draw back-layer outfits (capes, wings) behind everything
  backIds.forEach((id) => {
    svgContent += `
      <g class="outfit-layer outfit-back">
        ${getOutfitSVG(id)}
      </g>
    `;
  });

  // 1. Draw Legs (Behind body)
  svgContent += `
    <!-- Legs -->
    <g id="legs">
      <!-- Left Leg -->
      <line x1="112" y1="216" x2="98" y2="256" stroke="#1b222c" stroke-width="8" stroke-linecap="round" />
      <circle cx="95" cy="261" r="14" fill="#1b222c" />
      <!-- Right Leg -->
      <line x1="188" y1="216" x2="202" y2="256" stroke="#1b222c" stroke-width="8" stroke-linecap="round" />
      <circle cx="205" cy="261" r="14" fill="#1b222c" />
    </g>
  `;

  // 2. Draw Arms (Behind body)
  svgContent += `
    <!-- Arms -->
    <g id="arms">
      <!-- Left Arm -->
      <line x1="77" y1="150" x2="25" y2="162" stroke="#1b222c" stroke-width="8" stroke-linecap="round" />
      <circle cx="20" cy="163" r="14" fill="#1b222c" />
      <!-- Right Arm -->
      <line x1="223" y1="150" x2="275" y2="132" stroke="#1b222c" stroke-width="8" stroke-linecap="round" />
      <circle cx="280" cy="131" r="14" fill="#1b222c" />
    </g>
  `;

  // 3. Draw Body
  svgContent += `
    <!-- Circular Body with gradient & outline -->
    <circle cx="150" cy="150" r="75" fill="url(#body-gradient)" stroke="#1b222c" stroke-width="5.5" />
  `;

  // 4. Draw Face Features (Eyes, pupils, eyebrows, smile)
  svgContent += `
    <!-- Face -->
    <g id="face">
      <!-- Eyes Whites (tilted borderless ovals with dark outline) -->
      <ellipse cx="121" cy="122" rx="20" ry="22" transform="rotate(-6, 121, 122)" fill="#ffffff" stroke="#1b222c" stroke-width="4.5" />
      <ellipse cx="179" cy="116" rx="20" ry="22" transform="rotate(6, 179, 116)" fill="#ffffff" stroke="#1b222c" stroke-width="4.5" />
      
      <!-- Pupils -->
      <circle cx="123" cy="124" r="10" fill="#1b222c" />
      <circle cx="177" cy="118" r="10" fill="#1b222c" />
      
      <!-- Eyebrows -->
      <rect x="105" y="88" width="18" height="5" rx="2" transform="rotate(-6, 114, 90)" fill="#1b222c" />
      <rect x="177" y="82" width="18" height="5" rx="2" transform="rotate(6, 186, 84)" fill="#1b222c" />
      
      <!-- Smile Curve -->
      <path d="M 132 166 Q 150 184 168 166" stroke="#1b222c" stroke-width="6.5" stroke-linecap="round" fill="none" />
    </g>
  `;

  // 5. Draw front-layer outfits in stacking order (Nested SVG overlays)
  frontIds.forEach((id) => {
    svgContent += `
      <g class="outfit-layer outfit-front">
        ${getOutfitSVG(id)}
      </g>
    `;
  });

  // Close SVG Tag
  svgContent += `
    </svg>
  `;

  containerElement.innerHTML = svgContent;
}

/**
 * Initializes the 2D Sidebar character preview container
 * @param {HTMLElement} container - The DOM element where the preview is mounted
 */
export function initSidebarCharacter(container) {
  if (!container) return;
  containerElement = container;
  activeColor = getPlayerColor() || '#06b6d4';
  activeOutfitIds = getActiveOutfits();

  render2DSporky();
}

/**
 * Updates Sporky's body color in real-time
 * @param {string} hexColor - The color hex code
 */
export function updateSidebarCharacterColor(hexColor) {
  activeColor = hexColor;
  render2DSporky();
}

/**
 * Updates Sporky's equipped outfits in real-time
 * @param {string[]} outfitIds - The list of equipped outfit IDs
 */
export function updateSidebarCharacterOutfit(outfitIds) {
  activeOutfitIds = Array.isArray(outfitIds) ? outfitIds : (outfitIds ? [outfitIds] : []);
  render2DSporky();
}

/**
 * Stops the sidebar character
 */
export function stopSidebarCharacter() {
  containerElement = null;
}

/**
 * Resizes the container (noop since SVG scales natively)
 */
export function handleResize() {
  // SVG scales natively using viewBox, no action needed
}
