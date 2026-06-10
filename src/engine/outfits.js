// Metadata for the outfit shop.
// `layer` controls stacking when multiple items are worn:
//   negative = drawn BEHIND Sporky (capes, wings), higher = drawn on top.
// `slot` enforces one-per-type: equipping an item replaces any worn item
//   sharing the same slot. Items with unique slots stack freely.
// Brand tiers: Memu (suspiciously cheap) → South Face (solid) → Vermes (luxury).
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
    name: "South Face Parka",
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
    name: "South Face Scarf",
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
    name: "South Face Beanie",
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
  },  cheapwinterhat: {
    id: "cheapwinterhat",
    name: "Cheap Winter Hat",
    emoji: "🧢",
    price: 5,
    description: "A very cheap winter hat. It has a raster image inside!",
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
    name: "South Face Goggles",
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
    name: "South Face Earmuffs",
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
  facemittens: {
    id: "facemittens",
    name: "South Face Mittens",
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
  } else if (outfitId === "facemittens") {
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
  } else if (outfitId === "cheapwinterhat") {
    content = `
      <!-- Cheap Winter Hat Image -->
      <image width="289" height="214" id="cheap-winter-hat-img" href="data:image/png;base64,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" />
      <use href="#cheap-winter-hat-img" x="5" y="39"/>
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
