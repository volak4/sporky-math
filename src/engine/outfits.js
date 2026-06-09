// Metadata for the winter outfit shop
export const OUTFITS_DATA = {
  earmuffs: {
    id: 'earmuffs',
    name: 'Cozy Earmuffs',
    emoji: '🎧',
    price: 25,
    description: 'Keep Sporky\'s ears warm with these cozy teal earmuffs.',
    shop: 'zaina'
  },
  scarf: {
    id: 'scarf',
    name: 'Striped Scarf',
    emoji: '🧣',
    price: 40,
    description: 'A cozy red and white knit scarf for mountaineering.',
    shop: 'zaina'
  },
  beanie: {
    id: 'beanie',
    name: 'Winter Beanie',
    emoji: '❄️',
    price: 50,
    description: 'A classic winter hat topped with a fluffy white pom-pom.',
    shop: 'zaina'
  },
  goggles: {
    id: 'goggles',
    name: 'Ski Goggles',
    emoji: '🥽',
    price: 60,
    description: 'High-altitude orange tint goggles for bright snow glare.',
    shop: 'zaina'
  },
  jacket: {
    id: 'jacket',
    name: 'Winter Parka',
    emoji: '🧥',
    price: 100,
    description: 'A cozy, gender-neutral mountaineering parka with a fluffy collar.',
    shop: 'zaina'
  },
  jeans: {
    id: 'jeans',
    name: 'Denim Jeans',
    emoji: '👖',
    price: 35,
    description: 'Classic gender-neutral blue jeans that go both ways.',
    shop: 'tuscan'
  },
  tshirt: {
    id: 'tshirt',
    name: 'Star T-Shirt',
    emoji: '👕',
    price: 20,
    description: 'A cool, gender-neutral emerald t-shirt with a golden star.',
    shop: 'tuscan'
  }
};

/**
 * Returns the SVG string for a 2D winter outfit illustration
 * @param {string} outfitId - The ID of the outfit
 * @returns {string} - Full SVG element markup
 */
export function getOutfitSVG(outfitId) {
  if (!outfitId) return '';
  
  let content = '';
  
  if (outfitId === 'earmuffs') {
    content = `
      <!-- Headband -->
      <path d="M 85 130 A 68 68 0 0 1 215 130" stroke="#1b222c" stroke-width="7" fill="none" stroke-linecap="round" />
      <!-- Left Earmuff -->
      <g id="earmuff-left">
        <circle cx="74" cy="130" r="18" fill="#14b8a6" stroke="#1b222c" stroke-width="3" />
        <circle cx="60" cy="122" r="7" fill="#14b8a6" />
        <circle cx="58" cy="132" r="7" fill="#14b8a6" />
        <circle cx="62" cy="142" r="7" fill="#14b8a6" />
        <circle cx="70" cy="146" r="7" fill="#14b8a6" />
        <circle cx="80" cy="144" r="7" fill="#14b8a6" />
        <circle cx="86" cy="136" r="7" fill="#14b8a6" />
        <circle cx="84" cy="124" r="7" fill="#14b8a6" />
        <circle cx="74" cy="118" r="7" fill="#14b8a6" />
        <circle cx="74" cy="130" r="10" fill="#ffffff" stroke="#1b222c" stroke-width="2" />
      </g>
      <!-- Right Earmuff -->
      <g id="earmuff-right">
        <circle cx="226" cy="130" r="18" fill="#14b8a6" stroke="#1b222c" stroke-width="3" />
        <circle cx="240" cy="122" r="7" fill="#14b8a6" />
        <circle cx="242" cy="132" r="7" fill="#14b8a6" />
        <circle cx="238" cy="142" r="7" fill="#14b8a6" />
        <circle cx="230" cy="146" r="7" fill="#14b8a6" />
        <circle cx="220" cy="144" r="7" fill="#14b8a6" />
        <circle cx="214" cy="136" r="7" fill="#14b8a6" />
        <circle cx="216" cy="124" r="7" fill="#14b8a6" />
        <circle cx="226" cy="118" r="7" fill="#14b8a6" />
        <circle cx="226" cy="130" r="10" fill="#ffffff" stroke="#1b222c" stroke-width="2" />
      </g>
    `;
  } else if (outfitId === 'scarf') {
    content = `
      <!-- Scarf wrap -->
      <path d="M 82 190 Q 150 218 218 190 C 228 205, 215 228, 150 228 Q 72 205 82 190 Z" fill="#ef4444" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Stripes -->
      <path d="M 104 196 L 110 222" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
      <path d="M 126 200 L 130 226" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
      <path d="M 150 202 L 150 228" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
      <path d="M 174 200 L 170 226" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
      <path d="M 196 196 L 190 222" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
      <!-- Tail -->
      <path d="M 175 210 Q 192 240 188 275 C 178 278, 168 270, 170 250 L 163 210 Z" fill="#ef4444" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Stripes on tail -->
      <line x1="172" y1="230" x2="187" y2="235" stroke="#ffffff" stroke-width="7" stroke-linecap="round" />
      <line x1="170" y1="250" x2="184" y2="255" stroke="#ffffff" stroke-width="7" stroke-linecap="round" />
      <!-- Fringe -->
      <line x1="170" y1="275" x2="168" y2="283" stroke="#eab308" stroke-width="3" stroke-linecap="round" />
      <line x1="174" y1="276" x2="173" y2="284" stroke="#eab308" stroke-width="3" stroke-linecap="round" />
      <line x1="178" y1="277" x2="178" y2="285" stroke="#eab308" stroke-width="3" stroke-linecap="round" />
      <line x1="182" y1="276" x2="183" y2="284" stroke="#eab308" stroke-width="3" stroke-linecap="round" />
      <line x1="186" y1="274" x2="188" y2="282" stroke="#eab308" stroke-width="3" stroke-linecap="round" />
    `;
  } else if (outfitId === 'beanie') {
    // Knit stitches
    let knitStitches = '';
    for (let i = 0; i < 9; i++) {
      const t = i / 8;
      const x = 86 + t * 128;
      const y = 108 - Math.sin(t * Math.PI) * 9;
      knitStitches += `<path d="M ${x - 5} ${y - 4} L ${x} ${y} L ${x + 5} ${y - 4}" stroke="#2ec4b6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />`;
    }
    
    // Pom-pom loops
    let pompom = '<g id="pompom">';
    const colors = ['#f4a261', '#2ec4b6', '#e76f51', '#e9c46a'];
    for (let r = 0; r < 360; r += 36) {
      const rad = (r * Math.PI) / 180;
      const dx = Math.cos(rad) * 11;
      const dy = Math.sin(rad) * 11;
      const col = colors[(r / 36) % colors.length];
      pompom += `<circle cx="${150 + dx}" cy="${22 + dy}" r="7" fill="${col}" />`;
    }
    pompom += `<circle cx="150" cy="22" r="9" fill="#f4a261" />`;
    pompom += '</g>';

    content = `
      <!-- Beanie Dome -->
      <path d="M 76 96 Q 150 26 224 96 Z" fill="#e76f51" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Stripes on Dome -->
      <path d="M 85 84 Q 150 38 215 84" stroke="#f4a261" stroke-width="9" fill="none" stroke-linecap="round" />
      <path d="M 96 70 Q 150 34 204 70" stroke="#2a9d8f" stroke-width="9" fill="none" stroke-linecap="round" />
      <path d="M 110 56 Q 150 30 190 56" stroke="#e9c46a" stroke-width="9" fill="none" stroke-linecap="round" />
      
      <!-- Beanie Brim -->
      <path d="M 72 100 Q 150 78 228 100 C 235 110, 226 118, 220 116 Q 150 96 80 116 C 74 118, 65 110, 72 100 Z" fill="#8338ec" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Knit stitches -->
      ${knitStitches}
      
      <!-- Pom-pom -->
      ${pompom}
    `;
  } else if (outfitId === 'goggles') {
    content = `
      <!-- Goggle Strap -->
      <path d="M 78 122 Q 150 108 222 122" stroke="#2c3e50" stroke-width="14" fill="none" stroke-linecap="round" />
      <path d="M 78 122 Q 150 108 222 122" stroke="#7f8c8d" stroke-width="4" fill="none" stroke-linecap="round" />
      
      <!-- Goggle Frame -->
      <rect x="90" y="105" width="120" height="38" rx="19" fill="#1b222c" stroke="#ffffff" stroke-width="3" />
      
      <!-- Lens -->
      <rect x="96" y="111" width="108" height="26" rx="13" fill="url(#goggles-gradient)" />
      
      <!-- Glare -->
      <polygon points="175 113, 183 113, 175 135, 167 135" fill="#ffffff" opacity="0.6" />
      <polygon points="185 113, 190 113, 182 135, 177 135" fill="#ffffff" opacity="0.6" />
    `;
  } else if (outfitId === 'jacket') {
    content = `
      <!-- Jacket Body -->
      <path d="M 77 165 A 75 75 0 0 0 223 165 Q 150 148 77 165 Z" fill="#3b82f6" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      
      <!-- Collar -->
      <ellipse cx="150" cy="155" rx="55" ry="12" fill="#ffffff" stroke="#1b222c" stroke-width="4" />
      
      <!-- Zipper -->
      <line x1="150" y1="165" x2="150" y2="223" stroke="#1b222c" stroke-width="4" stroke-linecap="round" />
      
      <!-- Buttons -->
      <circle cx="128" cy="182" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="128" cy="205" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="172" cy="182" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="172" cy="205" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
    `;
  } else if (outfitId === 'jeans') {
    content = `
      <!-- Left Jean Leg Outline -->
      <line x1="111" y1="214" x2="99" y2="250" stroke="#1b222c" stroke-width="21" stroke-linecap="round" />
      <!-- Right Jean Leg Outline -->
      <line x1="189" y1="214" x2="201" y2="250" stroke="#1b222c" stroke-width="21" stroke-linecap="round" />
      
      <!-- Left Jean Leg Fill -->
      <line x1="111" y1="214" x2="99" y2="250" stroke="#3b82f6" stroke-width="15" stroke-linecap="round" />
      <!-- Right Jean Leg Fill -->
      <line x1="189" y1="214" x2="201" y2="250" stroke="#3b82f6" stroke-width="15" stroke-linecap="round" />
      
      <!-- Jeans Waistband/Hip Fill & Outline -->
      <path d="M 81 180 A 75 75 0 0 0 219 180 Q 150 170 81 180 Z" fill="#3b82f6" stroke="#1b222c" stroke-width="5.5" stroke-linejoin="round" />
      
      <!-- Stitching details -->
      <path d="M 83 182 Q 150 172 217 182" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" fill="none" />
      <line x1="111" y1="214" x2="99" y2="250" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" stroke-linecap="round" />
      <line x1="189" y1="214" x2="201" y2="250" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" stroke-linecap="round" />
      
      <!-- Front fly stitching -->
      <path d="M 150 183 L 150 205 Q 150 212 143 214" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" fill="none" />
      
      <!-- Copper button -->
      <circle cx="150" cy="180" r="5" fill="#f59e0b" stroke="#1b222c" stroke-width="2" />
      <circle cx="150" cy="180" r="1.5" fill="#d97706" />
    `;
  } else if (outfitId === 'tshirt') {
    content = `
      <!-- Left Sleeve Outline -->
      <line x1="77" y1="152" x2="48" y2="158" stroke="#1b222c" stroke-width="21" stroke-linecap="round" />
      <!-- Right Sleeve Outline -->
      <line x1="223" y1="152" x2="252" y2="142" stroke="#1b222c" stroke-width="21" stroke-linecap="round" />
      
      <!-- Left Sleeve Fill -->
      <line x1="77" y1="152" x2="48" y2="158" stroke="#10b981" stroke-width="13" stroke-linecap="round" />
      <!-- Right Sleeve Fill -->
      <line x1="223" y1="152" x2="252" y2="142" stroke="#10b981" stroke-width="13" stroke-linecap="round" />
      
      <!-- T-Shirt Body Fill & Outline -->
      <path d="M 83 205 Q 150 212 217 205 L 222 155 Q 150 148 78 155 Z" fill="#10b981" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      
      <!-- Neckline Ribbing/Collar -->
      <path d="M 120 152 Q 150 160 180 152" stroke="#1b222c" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <path d="M 120 152 Q 150 160 180 152" stroke="#059669" stroke-width="1.5" fill="none" stroke-linecap="round" />
      
      <!-- Bottom hem double stitching -->
      <path d="M 86 201 Q 150 208 214 201" stroke="#059669" stroke-width="1.5" stroke-dasharray="3,3" fill="none" />
      
      <!-- Graphic Star (Yellow) -->
      <polygon points="150 170, 153 177, 161 177, 155 182, 157 190, 150 185, 143 190, 145 182, 139 177, 147 177" fill="#fbbf24" stroke="#1b222c" stroke-width="2" stroke-linejoin="round" />
    `;
  }

  const svgGrads = `
    <defs>
      <linearGradient id="goggles-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>
    </defs>
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
      ${svgGrads}
      <g id="outfit-wrapper">
        ${content}
      </g>
    </svg>
  `;
}

/**
 * No-op stub to prevent import compilation errors in other files
 */
export function attachOutfit(characterGroup, bodyMesh, outfitId, scaleFactor = 1.0) {
  // Outfits are no longer displayed on the 3D models per user request
}
