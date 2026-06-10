// Metadata for the outfit shop.
// `layer` controls stacking when multiple items are worn:
//   negative = drawn BEHIND Sporky (capes, wings), higher = drawn on top.
// `slot` enforces one-per-type: equipping an item replaces any worn item
//   sharing the same slot. Items with unique slots stack freely.
// Brand tiers: Memu (suspiciously cheap) → North Farce (solid) → Vermes (luxury).
export const OUTFITS_DATA = {
  // --- Coats ---
  memucoat: {
    id: "memucoat",
    name: "Memu Puffer",
    emoji: "🧥",
    price: 30,
    description: "Took 47 days to ship. Slightly lumpy, very pink.",
    shop: "zaina",
    layer: 3,
    slot: "coat",
  },
  jacket: {
    id: "jacket",
    name: "North Farce Parka",
    emoji: "🧥",
    price: 100,
    description: "Trail-tested and toasty. Built for real mountain weather.",
    shop: "zaina",
    layer: 3,
    slot: "coat",
  },
  vermescoat: {
    id: "vermescoat",
    name: "Vermes Overcoat",
    emoji: "🧥",
    price: 300,
    description: "Hand-stitched luxury with a fur collar and golden buttons.",
    shop: "zaina",
    layer: 3,
    slot: "coat",
  },
  // --- Scarves ---
  memuscarf: {
    id: "memuscarf",
    name: "Memu Scarf",
    emoji: "🧣",
    price: 15,
    description: "Only slightly itchy. The hole adds ventilation!",
    shop: "zaina",
    layer: 4,
    slot: "scarf",
  },
  scarf: {
    id: "scarf",
    name: "North Farce Scarf",
    emoji: "🧣",
    price: 40,
    description: "A cozy red and white knit scarf for mountaineering.",
    shop: "zaina",
    layer: 4,
    slot: "scarf",
  },
  vermesscarf: {
    id: "vermesscarf",
    name: "Vermes Silk Scarf",
    emoji: "🧣",
    price: 150,
    description: "Spun from golden silk. Flutters dramatically in mountain wind.",
    shop: "zaina",
    layer: 4,
    slot: "scarf",
  },
  // --- Hats ---
  memubeanie: {
    id: "memubeanie",
    name: "Memu Beanie",
    emoji: "🧢",
    price: 12,
    description: "The pom-pom is hanging on by a single thread. Literally.",
    shop: "zaina",
    layer: 8,
    slot: "hat",
  },
  beanie: {
    id: "beanie",
    name: "North Farce Beanie",
    emoji: "❄️",
    price: 50,
    description: "A classic winter hat topped with a fluffy white pom-pom.",
    shop: "zaina",
    layer: 8,
    slot: "hat",
  },
  vermeshat: {
    id: "vermeshat",
    name: "Vermes Fur Hat",
    emoji: "🎩",
    price: 200,
    description: "A majestic fur hat with a golden crest. Fit for summit royalty.",
    shop: "zaina",
    layer: 8,
    slot: "hat",
  },
  // --- Goggles ---
  memugoggles: {
    id: "memugoggles",
    name: "Memu Goggles",
    emoji: "🥽",
    price: 20,
    description: "Pre-cracked for that experienced-climber look. Tape included.",
    shop: "zaina",
    layer: 5,
    slot: "goggles",
  },
  goggles: {
    id: "goggles",
    name: "North Farce Goggles",
    emoji: "🥽",
    price: 1,
    description: "High-altitude orange tint goggles for bright snow glare.",
    shop: "zaina",
    layer: 5,
    slot: "goggles",
  },
  vermesgoggles: {
    id: "vermesgoggles",
    name: "Vermes Goggles",
    emoji: "🕶️",
    price: 250,
    description: "24-karat gold frames with diamond studs. Snow glare? Never heard of it.",
    shop: "zaina",
    layer: 5,
    slot: "goggles",
  },
  // --- Earmuffs ---
  memuearmuffs: {
    id: "memuearmuffs",
    name: "Memu Earmuffs",
    emoji: "🎧",
    price: 8,
    description: "Two different colors, because matching costs extra.",
    shop: "zaina",
    layer: 6,
    slot: "earmuffs",
  },
  earmuffs: {
    id: "earmuffs",
    name: "North Farce Earmuffs",
    emoji: "🎧",
    price: 25,
    description: "Keep Sporky's ears warm with these cozy teal earmuffs.",
    shop: "zaina",
    layer: 6,
    slot: "earmuffs",
  },
  vermesearmuffs: {
    id: "vermesearmuffs",
    name: "Vermes Earmuffs",
    emoji: "💎",
    price: 100,
    description: "Cloud-soft fur on a golden arch, with a gem for each ear.",
    shop: "zaina",
    layer: 6,
    slot: "earmuffs",
  },
  // --- Mittens ---
  memumittens: {
    id: "memumittens",
    name: "Memu Mittens",
    emoji: "🧤",
    price: 10,
    description: "One pink, one green. They ran out of pairs.",
    shop: "zaina",
    layer: 11,
    slot: "mittens",
  },
  farcemittens: {
    id: "farcemittens",
    name: "North Farce Mittens",
    emoji: "🧤",
    price: 35,
    description: "Sturdy thermal mittens with a proper grip.",
    shop: "zaina",
    layer: 11,
    slot: "mittens",
  },
  vermesmittens: {
    id: "vermesmittens",
    name: "Vermes Mittens",
    emoji: "🧤",
    price: 120,
    description: "Velvet-lined cashmere mittens with golden cuffs.",
    shop: "zaina",
    layer: 11,
    slot: "mittens",
  },
  // --- Epic Gear ---
  ninja: {
    id: "ninja",
    name: "Ninja Headband",
    emoji: "🥷",
    price: 70,
    description: "A stealthy shadow-warrior headband with a steel plate.",
    shop: "zaina",
    layer: 7,
    slot: "headband",
  },
  viking: {
    id: "viking",
    name: "Viking Helmet",
    emoji: "⚔️",
    price: 95,
    description: "A battle-worn horned helmet for fearless mountain raiders.",
    shop: "zaina",
    layer: 8,
    slot: "helmet",
  },
  wizardhat: {
    id: "wizardhat",
    name: "Wizard Hat",
    emoji: "🧙",
    price: 85,
    description: "A starry sorcerer's hat crackling with mountain magic.",
    shop: "zaina",
    layer: 9,
    slot: "wizardhat",
  },
  crown: {
    id: "crown",
    name: "Golden Crown",
    emoji: "👑",
    price: 250,
    description: "The legendary jeweled crown of the Summit Monarch.",
    shop: "zaina",
    layer: 10,
    slot: "crown",
  },
  cape: {
    id: "cape",
    name: "Hero Cape",
    emoji: "🦸",
    price: 120,
    description:
      "A flowing crimson cape with golden trim. Every hero needs one.",
    shop: "zaina",
    layer: -2,
    slot: "cape",
  },
  dragonwings: {
    id: "dragonwings",
    name: "Dragon Wings",
    emoji: "🐉",
    price: 150,
    description: "Mighty emerald dragon wings. Soar above the summit!",
    shop: "zaina",
    layer: -1,
    slot: "wings",
  },
  // --- Tuscan Basics ---
  jeans: {
    id: "jeans",
    name: "Denim Jeans",
    emoji: "👖",
    price: 35,
    description: "Classic gender-neutral blue jeans that go both ways.",
    shop: "tuscan",
    layer: 1,
    slot: "legs",
  },
  tshirt: {
    id: "tshirt",
    name: "Star T-Shirt",
    emoji: "👕",
    price: 20,
    description: "A cool, gender-neutral emerald t-shirt with a golden star.",
    shop: "tuscan",
    layer: 2,
    slot: "shirt",
  },
};

/**
 * Returns the SVG string for a 2D winter outfit illustration
 * @param {string} outfitId - The ID of the outfit
 * @returns {string} - Full SVG element markup
 */
export function getOutfitSVG(outfitId) {
  if (!outfitId) return "";

  let content = "";

  if (outfitId === "earmuffs") {
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
  } else if (outfitId === "scarf") {
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
  } else if (outfitId === "beanie") {
    // Knit stitches
    let knitStitches = "";
    for (let i = 0; i < 9; i++) {
      const t = i / 8;
      const x = 86 + t * 128;
      const y = 108 - Math.sin(t * Math.PI) * 9;
      knitStitches += `<path d="M ${x - 5} ${y - 4} L ${x} ${y} L ${x + 5} ${y - 4}" stroke="#2ec4b6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />`;
    }

    // Pom-pom loops
    let pompom = '<g id="pompom">';
    const colors = ["#f4a261", "#2ec4b6", "#e76f51", "#e9c46a"];
    for (let r = 0; r < 360; r += 36) {
      const rad = (r * Math.PI) / 180;
      const dx = Math.cos(rad) * 11;
      const dy = Math.sin(rad) * 11;
      const col = colors[(r / 36) % colors.length];
      pompom += `<circle cx="${150 + dx}" cy="${22 + dy}" r="7" fill="${col}" />`;
    }
    pompom += `<circle cx="150" cy="22" r="9" fill="#f4a261" />`;
    pompom += "</g>";

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
  } else if (outfitId === "goggles") {
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
  } else if (outfitId === "jacket") {
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
  } else if (outfitId === "jeans") {
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
  } else if (outfitId === "tshirt") {
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
  } else if (outfitId === "cape") {
    content = `
      <!-- Cape Body (flares wide beyond Sporky's body) -->
      <path d="M 100 112 Q 150 92 200 112 C 230 140 252 190 262 252 Q 264 268 246 270 Q 222 280 196 272 Q 172 284 150 284 Q 128 284 104 272 Q 78 280 54 270 Q 36 268 38 252 C 48 190 70 140 100 112 Z"
            fill="#dc2626" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Inner shading folds -->
      <path d="M 86 150 Q 68 200 54 252" stroke="#b91c1c" stroke-width="7" fill="none" stroke-linecap="round" />
      <path d="M 214 150 Q 232 200 246 252" stroke="#b91c1c" stroke-width="7" fill="none" stroke-linecap="round" />
      <!-- Golden trim along bottom -->
      <path d="M 42 254 Q 76 274 104 266 Q 128 278 150 278 Q 172 278 196 266 Q 224 274 258 254"
            stroke="#fbbf24" stroke-width="5" fill="none" stroke-linecap="round" />
    `;
  } else if (outfitId === "dragonwings") {
    const wing = `
      <!-- Wing membrane (large bat-wing sweeping up and out) -->
      <path d="M 110 170 C 95 120 62 70 12 48 C 28 72 34 94 30 116 C 48 110 60 122 58 144 C 74 138 86 150 84 172 C 94 168 104 168 112 178 Z"
            fill="#16a34a" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Membrane ribs -->
      <path d="M 106 162 C 88 116 60 76 26 56" stroke="#15803d" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M 104 168 C 90 136 72 114 50 102" stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 104 174 C 94 154 82 142 72 136" stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- Wing claw at tip -->
      <circle cx="12" cy="48" r="5.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
    `;
    content = `
      <g id="wing-left">${wing}</g>
      <g id="wing-right" transform="translate(300,0) scale(-1,1)">${wing}</g>
    `;
  } else if (outfitId === "ninja") {
    content = `
      <!-- Headband tails (flowing right) -->
      <path d="M 218 100 Q 248 92 262 74 Q 258 94 244 104 Z" fill="#1e293b" stroke="#1b222c" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M 218 104 Q 252 110 268 132 Q 244 128 226 116 Z" fill="#1e293b" stroke="#1b222c" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Headband -->
      <path d="M 78 96 Q 150 80 222 96 L 222 114 Q 150 98 78 114 Z" fill="#1e293b" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Steel plate -->
      <rect x="128" y="84" width="44" height="22" rx="5" fill="#94a3b8" stroke="#1b222c" stroke-width="3.5" />
      <!-- Plate emblem: swift slash mark -->
      <path d="M 138 100 L 150 88 L 148 96 L 162 90" stroke="#1b222c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Plate rivets -->
      <circle cx="133" cy="95" r="2" fill="#475569" />
      <circle cx="167" cy="95" r="2" fill="#475569" />
    `;
  } else if (outfitId === "viking") {
    content = `
      <!-- Left Horn -->
      <path d="M 88 96 C 66 88 50 70 46 42 C 60 50 76 64 86 80 Z" fill="#f5f0e1" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <path d="M 52 56 C 60 60 68 66 74 72" stroke="#d6cdb8" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- Right Horn -->
      <path d="M 212 96 C 234 88 250 70 254 42 C 240 50 224 64 214 80 Z" fill="#f5f0e1" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <path d="M 248 56 C 240 60 232 66 226 72" stroke="#d6cdb8" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- Helmet Dome -->
      <path d="M 82 102 A 68 56 0 0 1 218 102 Z" fill="#94a3b8" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Center ridge -->
      <path d="M 150 46 L 150 100" stroke="#64748b" stroke-width="6" stroke-linecap="round" />
      <!-- Dome shine -->
      <path d="M 102 84 Q 112 62 134 54" stroke="#cbd5e1" stroke-width="5" fill="none" stroke-linecap="round" />
      <!-- Brim Band -->
      <path d="M 78 100 Q 150 84 222 100 L 222 114 Q 150 98 78 114 Z" fill="#64748b" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <!-- Rivets -->
      <circle cx="100" cy="103" r="3.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2" />
      <circle cx="150" cy="97" r="3.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2" />
      <circle cx="200" cy="103" r="3.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2" />
    `;
  } else if (outfitId === "wizardhat") {
    content = `
      <!-- Hat Cone (bent tip) -->
      <path d="M 114 92 C 122 58 140 28 160 12 C 170 4 182 2 184 10 C 186 17 177 17 170 26 C 152 48 172 68 188 92 Z"
            fill="#7c3aed" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Cone shading -->
      <path d="M 130 80 C 138 56 150 36 164 22" stroke="#6d28d9" stroke-width="5" fill="none" stroke-linecap="round" />
      <!-- Stars on cone -->
      <polygon points="152 52, 154 57, 159 57, 155 60, 157 65, 152 62, 147 65, 149 60, 145 57, 150 57" fill="#fbbf24" stroke="#1b222c" stroke-width="1.5" stroke-linejoin="round" />
      <polygon points="168 74, 170 78, 174 78, 171 81, 172 85, 168 83, 164 85, 165 81, 162 78, 166 78" fill="#fbbf24" stroke="#1b222c" stroke-width="1.5" stroke-linejoin="round" />
      <!-- Crescent moon -->
      <path d="M 138 70 A 7 7 0 1 0 144 60 A 5.5 5.5 0 1 1 138 70 Z" fill="#fbbf24" stroke="#1b222c" stroke-width="1.5" />
      <!-- Gold band -->
      <path d="M 112 92 Q 150 82 190 92 L 188 102 Q 150 92 114 102 Z" fill="#fbbf24" stroke="#1b222c" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Brim -->
      <ellipse cx="150" cy="100" rx="64" ry="14" fill="#7c3aed" stroke="#1b222c" stroke-width="4.5" />
      <!-- Brim highlight -->
      <path d="M 96 98 Q 150 88 204 98" stroke="#8b5cf6" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Sparkles around hat -->
      <path d="M 96 60 L 96 70 M 91 65 L 101 65" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" />
      <path d="M 212 50 L 212 58 M 208 54 L 216 54" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (outfitId === "crown") {
    content = `
      <!-- Crown Band & Points -->
      <path d="M 104 100 L 100 62 L 122 82 L 138 54 L 150 76 L 162 54 L 178 82 L 200 62 L 196 100 Q 150 110 104 100 Z"
            fill="#fbbf24" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Band base -->
      <path d="M 103 92 Q 150 102 197 92 L 196 100 Q 150 110 104 100 Z" fill="#f59e0b" stroke="#1b222c" stroke-width="3" stroke-linejoin="round" />
      <!-- Point tip orbs -->
      <circle cx="100" cy="60" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="138" cy="52" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="162" cy="52" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="200" cy="60" r="5" fill="#fbbf24" stroke="#1b222c" stroke-width="2.5" />
      <!-- Jewels -->
      <circle cx="124" cy="90" r="5.5" fill="#ef4444" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="150" cy="93" r="6.5" fill="#3b82f6" stroke="#1b222c" stroke-width="2.5" />
      <circle cx="176" cy="90" r="5.5" fill="#22c55e" stroke="#1b222c" stroke-width="2.5" />
      <!-- Shine -->
      <path d="M 112 72 L 116 80" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" />
      <path d="M 147 88 L 150 90" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (outfitId === "memucoat") {
    content = `
      <!-- Lumpy puffer body -->
      <path d="M 77 165 A 75 75 0 0 0 223 165 Q 150 148 77 165 Z" fill="#ec4899" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Puffy segment seams -->
      <path d="M 80 183 Q 150 168 220 183" stroke="#be185d" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M 88 203 Q 150 191 212 203" stroke="#be185d" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <!-- Crooked zipper -->
      <path d="M 150 162 L 146 185 L 152 207 L 148 222" stroke="#1b222c" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Patch -->
      <g transform="rotate(8, 190, 201)">
        <rect x="178" y="192" width="24" height="18" rx="3" fill="#f59e0b" stroke="#1b222c" stroke-width="2.5" />
        <path d="M 182 196 L 198 206 M 198 196 L 182 206" stroke="#92400e" stroke-width="2" stroke-linecap="round" />
      </g>
      <!-- Dangling price tag -->
      <line x1="105" y1="178" x2="96" y2="202" stroke="#94a3b8" stroke-width="2" />
      <g transform="rotate(-12, 96, 211)">
        <rect x="84" y="203" width="26" height="16" rx="2" fill="#ffffff" stroke="#1b222c" stroke-width="2.5" />
        <text x="88" y="215" font-size="10" font-weight="bold" fill="#ef4444">-90%</text>
      </g>
    `;
  } else if (outfitId === "vermescoat") {
    content = `
      <!-- Overcoat body -->
      <path d="M 77 165 A 75 75 0 0 0 223 165 Q 150 148 77 165 Z" fill="#881337" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Gold hem trim -->
      <path d="M 92 207 Q 150 230 208 207" stroke="#fbbf24" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Fur collar -->
      <ellipse cx="150" cy="155" rx="58" ry="13" fill="#fef3c7" stroke="#1b222c" stroke-width="4" />
      <circle cx="104" cy="158" r="7" fill="#fef3c7" />
      <circle cx="127" cy="164" r="7" fill="#fef3c7" />
      <circle cx="150" cy="166" r="7" fill="#fef3c7" />
      <circle cx="173" cy="164" r="7" fill="#fef3c7" />
      <circle cx="196" cy="158" r="7" fill="#fef3c7" />
      <!-- Double-breasted gold buttons -->
      <circle cx="130" cy="182" r="4.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2" />
      <circle cx="132" cy="200" r="4.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2" />
      <circle cx="170" cy="182" r="4.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2" />
      <circle cx="168" cy="200" r="4.5" fill="#fbbf24" stroke="#1b222c" stroke-width="2" />
      <!-- V monogram -->
      <path d="M 142 192 L 150 210 L 158 192" stroke="#fbbf24" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Sparkle -->
      <path d="M 200 178 L 200 186 M 196 182 L 204 182" stroke="#fef3c7" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (outfitId === "memuscarf") {
    content = `
      <!-- Thin raggedy scarf wrap -->
      <path d="M 82 190 Q 150 218 218 190 C 228 205, 215 228, 150 228 Q 72 205 82 190 Z" fill="#a3e635" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Sloppy stitches -->
      <path d="M 100 200 L 108 204 M 130 208 L 138 210 M 165 210 L 173 207 M 195 202 L 202 198" stroke="#4d7c0f" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" />
      <!-- Moth hole -->
      <ellipse cx="175" cy="212" rx="6" ry="4" fill="#1b222c" opacity="0.35" />
      <!-- Short frayed tail -->
      <path d="M 128 215 Q 120 235 124 252 L 142 248 Q 140 232 142 218 Z" fill="#a3e635" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <!-- Fray threads -->
      <line x1="126" y1="252" x2="124" y2="262" stroke="#4d7c0f" stroke-width="2" stroke-linecap="round" />
      <line x1="132" y1="251" x2="131" y2="263" stroke="#4d7c0f" stroke-width="2" stroke-linecap="round" />
      <line x1="138" y1="250" x2="139" y2="261" stroke="#4d7c0f" stroke-width="2" stroke-linecap="round" />
      <!-- Loose thread curling off -->
      <path d="M 218 196 Q 232 200 230 212 Q 228 220 236 222" stroke="#4d7c0f" stroke-width="2" fill="none" stroke-linecap="round" />
    `;
  } else if (outfitId === "vermesscarf") {
    content = `
      <!-- Silk scarf wrap -->
      <path d="M 82 190 Q 150 218 218 190 C 228 205, 215 228, 150 228 Q 72 205 82 190 Z" fill="#f59e0b" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Silk sheen swirls -->
      <path d="M 98 198 Q 112 208 102 216" stroke="#fcd34d" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 143 204 Q 157 212 147 222" stroke="#fcd34d" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 188 198 Q 202 206 192 214" stroke="#fcd34d" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- Two flowing tails -->
      <path d="M 120 214 Q 100 245 108 278 C 118 282 128 276 126 258 L 132 218 Z" fill="#f59e0b" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <path d="M 180 214 Q 202 242 196 276 C 186 280 176 274 178 256 L 170 218 Z" fill="#f59e0b" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <!-- V pattern on tails -->
      <path d="M 110 248 L 116 256 L 122 248" stroke="#fef3c7" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 182 246 L 188 254 L 194 246" stroke="#fef3c7" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Gold tassels -->
      <line x1="108" y1="278" x2="104" y2="288" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
      <line x1="114" y1="280" x2="112" y2="290" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
      <line x1="120" y1="279" x2="120" y2="289" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
      <line x1="190" y1="277" x2="192" y2="287" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
      <line x1="196" y1="275" x2="199" y2="285" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (outfitId === "memubeanie") {
    content = `
      <!-- Saggy lopsided dome -->
      <path d="M 78 100 C 84 58 130 34 178 46 C 210 54 226 76 222 98 Q 150 82 78 100 Z" fill="#9ca3af" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Droopy fold -->
      <path d="M 96 78 Q 140 60 196 66" stroke="#6b7280" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Crooked brim -->
      <path d="M 74 102 Q 150 80 226 96 L 224 112 Q 150 96 76 116 Z" fill="#6b7280" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <!-- Patch -->
      <g transform="rotate(-7, 130, 69)">
        <rect x="120" y="62" width="20" height="14" rx="2" fill="#f59e0b" stroke="#1b222c" stroke-width="2" />
      </g>
      <!-- Pom-pom dangling off the side by a thread -->
      <path d="M 212 56 Q 226 62 230 74" stroke="#6b7280" stroke-width="2" fill="none" />
      <circle cx="232" cy="82" r="9" fill="#d1d5db" stroke="#1b222c" stroke-width="2.5" />
    `;
  } else if (outfitId === "vermeshat") {
    content = `
      <!-- Fur dome -->
      <path d="M 78 98 A 72 58 0 0 1 222 98 Z" fill="#7c2d12" stroke="#1b222c" stroke-width="4.5" stroke-linejoin="round" />
      <!-- Fur texture arcs -->
      <path d="M 100 78 Q 112 58 134 50" stroke="#9a3412" stroke-width="4" fill="none" stroke-linecap="round" />
      <path d="M 166 50 Q 188 58 200 78" stroke="#9a3412" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Cream fur trim band -->
      <path d="M 74 100 Q 150 84 226 100 L 226 116 Q 150 100 74 116 Z" fill="#fef3c7" stroke="#1b222c" stroke-width="4" stroke-linejoin="round" />
      <!-- Fluff scallops on trim -->
      <circle cx="92" cy="100" r="6" fill="#fef3c7" />
      <circle cx="116" cy="95" r="6" fill="#fef3c7" />
      <circle cx="184" cy="95" r="6" fill="#fef3c7" />
      <circle cx="208" cy="100" r="6" fill="#fef3c7" />
      <!-- Gold medallion with ruby -->
      <circle cx="150" cy="98" r="10" fill="#fbbf24" stroke="#1b222c" stroke-width="3" />
      <circle cx="150" cy="98" r="4.5" fill="#ef4444" />
      <!-- Sparkles -->
      <path d="M 94 56 L 94 64 M 90 60 L 98 60" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 210 50 L 210 58 M 206 54 L 214 54" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (outfitId === "memugoggles") {
    content = `
      <!-- Flimsy strap -->
      <path d="M 78 122 Q 150 108 222 122" stroke="#6b7280" stroke-width="12" fill="none" stroke-linecap="round" />
      <!-- Frame -->
      <rect x="90" y="105" width="120" height="38" rx="19" fill="#4b5563" stroke="#1b222c" stroke-width="3.5" />
      <!-- Cheap blue lens -->
      <rect x="96" y="111" width="108" height="26" rx="13" fill="#93c5fd" />
      <!-- Crack -->
      <path d="M 118 111 L 128 122 L 120 128 L 132 137" stroke="#1e3a8a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 128 122 L 139 119" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round" />
      <!-- Tape holding the corner together -->
      <g transform="rotate(24, 199, 107)">
        <rect x="186" y="100" width="26" height="14" rx="2" fill="#e5e7eb" stroke="#1b222c" stroke-width="2" />
        <line x1="191" y1="103" x2="191" y2="111" stroke="#9ca3af" stroke-width="1.5" />
        <line x1="199" y1="103" x2="199" y2="111" stroke="#9ca3af" stroke-width="1.5" />
        <line x1="207" y1="103" x2="207" y2="111" stroke="#9ca3af" stroke-width="1.5" />
      </g>
    `;
  } else if (outfitId === "vermesgoggles") {
    content = `
      <!-- Leather strap with gold stripe -->
      <path d="M 78 122 Q 150 108 222 122" stroke="#92400e" stroke-width="14" fill="none" stroke-linecap="round" />
      <path d="M 78 122 Q 150 108 222 122" stroke="#fbbf24" stroke-width="5" fill="none" stroke-linecap="round" />
      <!-- Gold frame -->
      <rect x="88" y="103" width="124" height="42" rx="21" fill="#fbbf24" stroke="#1b222c" stroke-width="3.5" />
      <!-- Gradient lens -->
      <rect x="96" y="111" width="108" height="26" rx="13" fill="url(#vermes-lens-gradient)" />
      <!-- Diamond studs -->
      <circle cx="98" cy="124" r="3.5" fill="#ffffff" stroke="#1b222c" stroke-width="1.5" />
      <circle cx="202" cy="124" r="3.5" fill="#ffffff" stroke="#1b222c" stroke-width="1.5" />
      <!-- Glare -->
      <polygon points="170 113, 178 113, 170 135, 162 135" fill="#ffffff" opacity="0.7" />
      <!-- Sparkle -->
      <path d="M 218 96 L 218 104 M 214 100 L 222 100" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (outfitId === "memuearmuffs") {
    content = `
      <!-- Kinked headband -->
      <path d="M 85 130 Q 95 75 148 64 L 154 76 Q 200 84 215 130" stroke="#1b222c" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Left muff: pink, oversized -->
      <circle cx="74" cy="130" r="17" fill="#ec4899" stroke="#1b222c" stroke-width="3.5" />
      <circle cx="74" cy="130" r="9" fill="#fbcfe8" stroke="#1b222c" stroke-width="2" />
      <!-- Right muff: green, undersized -->
      <circle cx="226" cy="130" r="12" fill="#84cc16" stroke="#1b222c" stroke-width="3.5" />
      <circle cx="226" cy="130" r="6" fill="#d9f99d" stroke="#1b222c" stroke-width="2" />
      <!-- Sloppy stitches -->
      <path d="M 62 120 L 68 126 M 80 136 L 86 142" stroke="#9d174d" stroke-width="2" stroke-linecap="round" stroke-dasharray="2,2" />
    `;
  } else if (outfitId === "vermesearmuffs") {
    content = `
      <!-- Golden arch -->
      <path d="M 85 130 A 68 68 0 0 1 215 130" stroke="#fbbf24" stroke-width="8" fill="none" stroke-linecap="round" />
      <!-- Left fluffy muff -->
      <g id="vermes-muff-left">
        <circle cx="62" cy="121" r="7" fill="#fef3c7" />
        <circle cx="59" cy="132" r="7" fill="#fef3c7" />
        <circle cx="63" cy="142" r="7" fill="#fef3c7" />
        <circle cx="72" cy="146" r="7" fill="#fef3c7" />
        <circle cx="82" cy="143" r="7" fill="#fef3c7" />
        <circle cx="87" cy="134" r="7" fill="#fef3c7" />
        <circle cx="85" cy="123" r="7" fill="#fef3c7" />
        <circle cx="74" cy="117" r="7" fill="#fef3c7" />
        <circle cx="74" cy="131" r="13" fill="#fef3c7" stroke="#1b222c" stroke-width="3" />
        <circle cx="74" cy="131" r="6" fill="#a855f7" stroke="#1b222c" stroke-width="2" />
      </g>
      <!-- Right fluffy muff -->
      <g id="vermes-muff-right" transform="translate(300,0) scale(-1,1)">
        <circle cx="62" cy="121" r="7" fill="#fef3c7" />
        <circle cx="59" cy="132" r="7" fill="#fef3c7" />
        <circle cx="63" cy="142" r="7" fill="#fef3c7" />
        <circle cx="72" cy="146" r="7" fill="#fef3c7" />
        <circle cx="82" cy="143" r="7" fill="#fef3c7" />
        <circle cx="87" cy="134" r="7" fill="#fef3c7" />
        <circle cx="85" cy="123" r="7" fill="#fef3c7" />
        <circle cx="74" cy="117" r="7" fill="#fef3c7" />
        <circle cx="74" cy="131" r="13" fill="#fef3c7" stroke="#1b222c" stroke-width="3" />
        <circle cx="74" cy="131" r="6" fill="#a855f7" stroke="#1b222c" stroke-width="2" />
      </g>
      <!-- Sparkle on arch -->
      <path d="M 150 70 L 150 78 M 146 74 L 154 74" stroke="#fef3c7" stroke-width="2.5" stroke-linecap="round" />
    `;
  } else if (outfitId === "memumittens") {
    content = `
      <!-- Left mitten: pink -->
      <line x1="38" y1="159" x2="46" y2="157" stroke="#1b222c" stroke-width="16" stroke-linecap="round" />
      <line x1="38" y1="159" x2="46" y2="157" stroke="#9d174d" stroke-width="10" stroke-linecap="round" />
      <circle cx="31" cy="150" r="7" fill="#ec4899" stroke="#1b222c" stroke-width="3" />
      <circle cx="20" cy="163" r="17" fill="#ec4899" stroke="#1b222c" stroke-width="4" />
      <path d="M 12 156 L 18 162 M 22 168 L 28 174" stroke="#9d174d" stroke-width="2" stroke-linecap="round" stroke-dasharray="2,2" />
      <!-- Right mitten: green (they ran out of pairs) -->
      <line x1="262" y1="136" x2="254" y2="139" stroke="#1b222c" stroke-width="16" stroke-linecap="round" />
      <line x1="262" y1="136" x2="254" y2="139" stroke="#3f6212" stroke-width="10" stroke-linecap="round" />
      <circle cx="269" cy="119" r="7" fill="#84cc16" stroke="#1b222c" stroke-width="3" />
      <circle cx="280" cy="131" r="17" fill="#84cc16" stroke="#1b222c" stroke-width="4" />
      <path d="M 272 124 L 278 130 M 282 136 L 288 142" stroke="#3f6212" stroke-width="2" stroke-linecap="round" stroke-dasharray="2,2" />
    `;
  } else if (outfitId === "farcemittens") {
    content = `
      <!-- Left mitten -->
      <line x1="38" y1="159" x2="46" y2="157" stroke="#1b222c" stroke-width="16" stroke-linecap="round" />
      <line x1="38" y1="159" x2="46" y2="157" stroke="#115e59" stroke-width="10" stroke-linecap="round" />
      <circle cx="31" cy="150" r="7" fill="#0d9488" stroke="#1b222c" stroke-width="3" />
      <circle cx="20" cy="163" r="17" fill="#0d9488" stroke="#1b222c" stroke-width="4" />
      <path d="M 14 157 L 26 169 M 26 157 L 14 169 M 20 155 L 20 171" stroke="#ccfbf1" stroke-width="2" stroke-linecap="round" />
      <!-- Right mitten -->
      <line x1="262" y1="136" x2="254" y2="139" stroke="#1b222c" stroke-width="16" stroke-linecap="round" />
      <line x1="262" y1="136" x2="254" y2="139" stroke="#115e59" stroke-width="10" stroke-linecap="round" />
      <circle cx="269" cy="119" r="7" fill="#0d9488" stroke="#1b222c" stroke-width="3" />
      <circle cx="280" cy="131" r="17" fill="#0d9488" stroke="#1b222c" stroke-width="4" />
      <path d="M 274 125 L 286 137 M 286 125 L 274 137 M 280 123 L 280 139" stroke="#ccfbf1" stroke-width="2" stroke-linecap="round" />
    `;
  } else if (outfitId === "vermesmittens") {
    content = `
      <!-- Left mitten -->
      <line x1="38" y1="159" x2="46" y2="157" stroke="#1b222c" stroke-width="16" stroke-linecap="round" />
      <line x1="38" y1="159" x2="46" y2="157" stroke="#fbbf24" stroke-width="10" stroke-linecap="round" />
      <circle cx="31" cy="150" r="7" fill="#881337" stroke="#1b222c" stroke-width="3" />
      <circle cx="20" cy="163" r="17" fill="#881337" stroke="#1b222c" stroke-width="4" />
      <path d="M 14 158 L 20 170 L 26 158" stroke="#fbbf24" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Right mitten -->
      <line x1="262" y1="136" x2="254" y2="139" stroke="#1b222c" stroke-width="16" stroke-linecap="round" />
      <line x1="262" y1="136" x2="254" y2="139" stroke="#fbbf24" stroke-width="10" stroke-linecap="round" />
      <circle cx="269" cy="119" r="7" fill="#881337" stroke="#1b222c" stroke-width="3" />
      <circle cx="280" cy="131" r="17" fill="#881337" stroke="#1b222c" stroke-width="4" />
      <path d="M 274 126 L 280 138 L 286 126" stroke="#fbbf24" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Sparkles -->
      <path d="M 40 140 L 40 148 M 36 144 L 44 144" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 258 112 L 258 120 M 254 116 L 262 116" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
    `;
  }

  const svgGrads = `
    <defs>
      <linearGradient id="goggles-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>
      <linearGradient id="vermes-lens-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a855f7" />
        <stop offset="100%" stop-color="#fbbf24" />
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
export function attachOutfit(
  characterGroup,
  bodyMesh,
  outfitId,
  scaleFactor = 1.0,
) {
  // Outfits are no longer displayed on the 3D models per user request
}
