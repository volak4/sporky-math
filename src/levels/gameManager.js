import * as THREE from 'three';
import { levels } from './levelData.js';
import { createClimbingWall, setGridVisibility, setMountainVisibility, createHold, clearHolds, getHolds, getToonGradientTexture, getCoordinateOffset, isInsideMountain, setDestinationLabel, createSlopeValueLabel, createSignLabel } from '../engine/wall.js';
import { createClimber, setClimberPosition, animateToPosition, updateClimber, getClimberGroup, getClimberPosition, setClimberExpression, setClimberHovering } from '../engine/climber.js';
import { playSuccessSound, playFailureSound } from '../engine/audio.js';
import { setDragEnabled } from '../interactive/dragManager.js';
import { incrementSolvedCount, getLocalSolvedCount, setLocalSolvedCount, saveProgress, registerIncorrectAnswer } from '../lib/progressManager.js';
import {
  showLevelUI,
  updateCoordinatesDisplay,
  setNextButtonUnlocked,
  showToast,
  setTargetSlopeDisplay,
  getLevel3Inputs,
  setOnEquationChange,
  setTargetEquationLvl4,
  updateSolvedCount,
  triggerFlyingCoinAnimation,
  updateStreakDisplay,
  updateCoinDisplays
} from '../interactive/uiController.js';

let currentLevelIndex = 0;
let levelCompleted = false;
let sceneObj = null;
let lastSnappedPos = { x: 0, y: 0 };
let activeDragPath = [];
let level1Loads = 0; // Tracks Level 1 loaded count to trigger coordinate randomization
let challenge1SolvedCount = 0; // Tracks current coordinates found in Challenge 1
const challenge1TargetCount = 3; // Number of correct coordinates required to complete Challenge 1
let challenge2SolvedCount = 0;
let challenge3SolvedCount = 0;
let challenge4SolvedCount = 0;
let challenge5SolvedCount = 0;
let challenge6SolvedCount = 0;

let level4State = {
  phase: 'intercept', // 'intercept', 'slope', 'completed'
  rise: 0,
  run: 1,
  b: 0,
  placedInterceptPeg: false,
  placedDestPeg: false,
  segment1Rope: null,
  segment2Rope: null,
  fullLaserLine: null,
  interceptLabel: null,
  destLabel: null
};

let level5InterceptDot = null;
let level5InterceptLabel = null;
let level5SlopeLabel = null;

// Level 6 Graph Overlays
let level6GraphLine = null;
let level6GraphDots = [];

// Helper to choose a random valid coordinate for Level 1 that isn't the origin or the excluded coordinate
function getRandomTargetCoordinateExcluding(exclude) {
  const possibleCoords = [];
  for (let x = -4; x <= 4; x++) {
    for (let y = -4; y <= 4; y++) {
      if (!isInsideMountain(x, y)) continue;
      if (x === 0 && y === 0) continue; // Exclude start pos
      if (exclude && x === exclude.x && y === exclude.y) continue; // Exclude active target
      possibleCoords.push({ x, y });
    }
  }
  if (possibleCoords.length === 0) return { x: 2, y: 3 }; // Fallback
  const idx = Math.floor(Math.random() * possibleCoords.length);
  return possibleCoords[idx];
}

function getRandomTargetCoordinate() {
  return getRandomTargetCoordinateExcluding({ x: 3, y: 2 });
}

// Level 2 Visual Overlays
let ropeMesh = null;
let riseLine = null;
let runLine = null;

// Level 3 Visual Overlays
let laserLineMesh = null;

export function initGame(scene, camera) {
  sceneObj = scene;

  // Render the persistent modular climbing wall
  createClimbingWall(scene);

  // Initialize the climber
  createClimber(scene);

  // Load the first level
  loadLevel(0);

  // Set up listeners for live UI changes
  setOnEquationChange((m, b) => {
    updateEquationLaserOverlay(m, b);
  });
  // Character selection removed
}

export function getGameState() {
  return {
    currentLevelIndex,
    levelCompleted
  };
}

function formatEquationHTML(rise, run, b) {
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const divisor = Math.abs(gcd(rise, run));
  const simplifiedRise = rise / divisor;
  const simplifiedRun = run / divisor;

  let mStr = "";
  if (simplifiedRise === 1 && simplifiedRun === 1) {
    mStr = `<span class="run-color"></span>`;
  } else if (simplifiedRise === -1 && simplifiedRun === 1) {
    mStr = `<span style="color: #ef4444;">-</span>`;
  } else if (simplifiedRun === 1) {
    if (simplifiedRise < 0) {
      mStr = `<span style="color: #ef4444;">-</span><span class="run-color">${Math.abs(simplifiedRise)}</span>`;
    } else {
      mStr = `<span class="run-color">${simplifiedRise}</span>`;
    }
  } else {
    if (simplifiedRise < 0) {
      mStr = `<span style="color: #ef4444;">-</span><span class="rise-color">${Math.abs(simplifiedRise)}</span><span style="color: black;">/</span><span class="run-color">${simplifiedRun}</span>`;
    } else {
      mStr = `<span class="rise-color">${simplifiedRise}</span><span style="color: black;">/</span><span class="run-color">${simplifiedRun}</span>`;
    }
  }

  let bStr = "";
  if (b > 0) {
    bStr = `<span class="rise-color">+ ${b}</span>`;
  } else if (b < 0) {
    bStr = `<span style="color: #ef4444;">-</span> <span class="rise-color">${Math.abs(b)}</span>`;
  } else {
    bStr = `<span class="rise-color">+ 0</span>`;
  }
  return `<span style="display: inline-block; white-space: nowrap; text-wrap: nowrap;">y = ${mStr}x ${bStr}</span>`.trim();
}

// Returns a standalone hint line showing the slope as rise/run fraction
function formatSlopeHintHTML(rise, run) {
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const divisor = Math.abs(gcd(rise, run));
  const simplifiedRise = rise / divisor;
  const simplifiedRun = run / divisor;

  const riseSignHTML = simplifiedRise < 0 ? '<span style="color: #ef4444;">-</span>' : '';
  const riseNumHTML = `<span style="color: #000000;">${Math.abs(simplifiedRise)}</span>`;

  const runSignHTML = simplifiedRun < 0 ? '<span style="color: #ef4444;">-</span>' : '';
  const runNumHTML = `<span style="color: #000000;">${Math.abs(simplifiedRun)}</span>`;

  return `<span style="display:block; margin-top:4px; font-size:0.95rem; font-weight:600; color:#64748b;">💡 Slope = <span style="font-weight:700;"><sup>${riseSignHTML}${riseNumHTML}</sup>&frasl;<sub>${runSignHTML}${runNumHTML}</sub></span> <span style="opacity:0.7;">(<span style="color: #ca8a04; font-weight: 700;">up</span>/<span style="color: #ef4444; font-weight: 700;">down</span> &frasl; <span style="color: #ef4444; font-weight: 700;">left</span>/<span style="color: #16a34a; font-weight: 700;">right</span>)</span></span>`;
}

export function loadLevel(levelIndex, preserveSolvedCount = false) {
  currentLevelIndex = levelIndex;
  levelCompleted = false;
  setNextButtonUnlocked(false);

  setClimberHovering(levelIndex === 3);

  const level = levels[currentLevelIndex];

  // 1. Clear previous level's temporary holds and 3D shapes BEFORE level-specific
  // setup so that overlay references (e.g. level4State.fullLaserLine) are still
  // intact when clearOverlays() tries to remove them from the scene.
  clearHolds(sceneObj);
  clearOverlays();

  if (!preserveSolvedCount) {
    if (currentLevelIndex === 0) challenge1SolvedCount = getLocalSolvedCount(0);
    if (currentLevelIndex === 1) {
      challenge2SolvedCount = 0;
      setLocalSolvedCount(1, 0);
      saveProgress();
    }
    if (currentLevelIndex === 2) challenge3SolvedCount = getLocalSolvedCount(2);
    if (currentLevelIndex === 3) challenge4SolvedCount = getLocalSolvedCount(3);
    if (currentLevelIndex === 4) challenge5SolvedCount = getLocalSolvedCount(4);
    if (currentLevelIndex === 5) challenge6SolvedCount = getLocalSolvedCount(5);
  }

  // Randomize target position for Level 1 coordinates challenge on subsequent loads
  if (currentLevelIndex === 0) {
    level1Loads++;
    if (level1Loads > 1) {
      const newTarget = getRandomTargetCoordinate();
      level.targetPos = newTarget;
    } else {
      level.targetPos = { x: 3, y: 2 };
    }
    level.description = `Drag Sporky to the target peg at <span class='highlight-coord' id='target-coord-display'>(${level.targetPos.x}, ${level.targetPos.y})</span>.`;
  } else if (currentLevelIndex === 1) {
    // Pick a random starting pos inside the mountain
    let startPos = null;
    let targetPos = null;
    let targetSlope = null;
    let attempts = 0;

    // Difficulty progression based on challenge2SolvedCount
    const round = challenge2SolvedCount;
    let runSign = 1;
    let riseSign = 1;
    let isWhole = false;

    if (round === 0) {
      runSign = 1;
      riseSign = 1;
    } else if (round === 1) {
      runSign = 1;
      riseSign = -1;
    } else if (round === 2) {
      runSign = -1;
      riseSign = 1;
    } else if (round === 3) {
      runSign = -1;
      riseSign = -1;
    } else {
      isWhole = true;
    }

    while (attempts < 100) {
      attempts++;
      const startX = Math.floor(Math.random() * 9) - 4; // -4 to 4
      const startY = Math.floor(Math.random() * 9) - 4; // -4 to 4
      if (!isInsideMountain(startX, startY)) continue;

      let run, rise;
      if (isWhole) {
        run = 1;
        const possibleRises = [-3, -2, 2, 3];
        rise = possibleRises[Math.floor(Math.random() * possibleRises.length)];
      } else {
        // Choose run: 1, 2, or 3
        let runVal;
        if (Math.random() < 0.6) {
          runVal = 1;
        } else {
          runVal = Math.random() < 0.5 ? 2 : 3;
        }
        run = runVal * runSign;

        // Choose rise: 1, 2, or 3
        let riseVal;
        let innerAttempts = 0;
        do {
          innerAttempts++;
          riseVal = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
        } while (riseVal === runVal && innerAttempts < 10);
        rise = riseVal * riseSign;
      }

      if (rise === 0 || run === 0) continue;
      if (Math.abs(rise) === Math.abs(run)) continue; // Ensure rise and run are different (no equal top/bottom values)
      if (Math.abs(rise) + Math.abs(run) < 2) continue;

      const targetX = startX + run;
      const targetY = startY + rise;
      if (targetX < -4 || targetX > 4 || targetY < -4 || targetY > 4) continue;
      if (!isInsideMountain(targetX, targetY)) continue;

      startPos = { x: startX, y: startY };
      targetPos = { x: targetX, y: targetY };
      targetSlope = { rise, run };
      break;
    }

    if (!startPos) {
      // Fallback
      if (isWhole) {
        startPos = { x: -2, y: -2 };
        targetPos = { x: -1, y: 0 };
        targetSlope = { rise: 2, run: 1 };
      } else {
        startPos = { x: -2, y: -2 };
        const finalRun = (round === 4 || round === 5 || round === 6 || round === 7) ? -1 : 1;
        const finalRise = (round === 2 || round === 3 || round === 6 || round === 7) ? -2 : 2;
        targetPos = { x: -2 + finalRun, y: -2 + finalRise };
        targetSlope = { rise: finalRise, run: finalRun };
      }
    }

    level.startPos = startPos;
    level.targetPos = targetPos;
    level.targetSlope = targetSlope;

    const riseVal = targetSlope.rise;
    const runVal = targetSlope.run;

    const riseSignHTML = riseVal < 0 ? '<span style="color: #ef4444; margin-right: 1px;">-</span>' : '';
    const riseNumHTML = `<span style="color: #000000;">${Math.abs(riseVal)}</span>`;

    const runSignHTML = runVal < 0 ? '<span style="color: #ef4444; margin-right: 1px;">-</span>' : '';
    const runNumHTML = `<span style="color: #000000;">${Math.abs(runVal)}</span>`;

    let slopeDisplayHTML = "";
    if (isWhole) {
      slopeDisplayHTML = `
        <div id="slope-value-display-wrapper" style="display: flex; align-items: center; justify-content: center; height: 52px; padding: 0 10px;">
          <div style="font-size: 1.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">${riseSignHTML}${riseNumHTML}</div>
        </div>
      `;
    } else {
      slopeDisplayHTML = `
        <div id="slope-value-display-wrapper" style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; padding: 0 4px;">
          <div style="font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">${riseSignHTML}${riseNumHTML}</div>
          <div style="background: var(--color-border); width: 40px; height: 3px; margin: 4px 0;"></div>
          <div style="font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">${runSignHTML}${runNumHTML}</div>
        </div>
      `;
    }

    let hintBtnHTML = "";
    if (isWhole) {
      hintBtnHTML = `
        <div id="slope-hint-btn-wrapper" style="margin-top: 6px;">
          <button id="btn-slope-whole-hint" class="btn btn-secondary" style="font-size: 0.8rem; padding: 4px 10px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">Show Hint 💡</button>
        </div>
      `;
    }

    level.description = `
      <div style="margin-bottom: 12px;">
        <span style="font-weight: 700; font-size: 1.15rem;">Sporky starts at <span class="highlight-coord">(${startPos.x}, ${startPos.y})</span></span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; margin-top: 12px; margin-bottom: 12px; font-family: inherit;">
        <div style="font-weight: 700; font-size: 1.35rem; color: var(--color-border); white-space: nowrap;">Slope =</div>
        ${slopeDisplayHTML}
        <div style="display: flex; flex-direction: column; justify-content: space-between; height: 52px; font-size: 0.82rem; font-weight: 700; color: #475569; padding-left: 4px; white-space: nowrap;">
          <div style="display: flex; align-items: center; gap: 4px;">&larr; move <span style="color: #ca8a04;">up</span> or <span style="color: #ef4444;">down</span></div>
          <div style="display: flex; align-items: center; gap: 4px;">&larr; move <span style="color: #ef4444;">left</span> or <span style="color: #16a34a;">right</span></div>
        </div>
      </div>
      <div id="slope-hint-display-area"></div>
      ${hintBtnHTML}
    `;
  } else if (currentLevelIndex === 2) {
    // Pick a random starting pos inside the mountain
    let startPos = null;
    let targetPos = null;
    let attempts = 0;

    while (attempts < 100) {
      attempts++;
      const startX = Math.floor(Math.random() * 9) - 4; // -4 to 4
      const startY = Math.floor(Math.random() * 9) - 4; // -4 to 4
      if (!isInsideMountain(startX, startY)) continue;

      // Weight denominator (run) to be 1 or -1 in 60% of cases
      let run;
      if (Math.random() < 0.6) {
        run = Math.random() < 0.5 ? 1 : -1;
      } else {
        run = (Math.floor(Math.random() * 7) - 3); // -3 to 3
      }

      const rise = (Math.floor(Math.random() * 7) - 3); // -3 to 3
      if (rise === 0 || run === 0) continue;
      if (Math.abs(rise) === Math.abs(run)) continue; // Ensure rise and run are different (no equal top/bottom values)
      if (Math.abs(rise) + Math.abs(run) < 3) continue; // Minimum distance of 3 for challenge

      const targetX = startX + run;
      const targetY = startY + rise;
      if (targetX < -4 || targetX > 4 || targetY < -4 || targetY > 4) continue;
      if (!isInsideMountain(targetX, targetY)) continue;

      startPos = { x: startX, y: startY };
      targetPos = { x: targetX, y: targetY };
      break;
    }

    if (!startPos) {
      startPos = { x: -3, y: -2 };
      targetPos = { x: 1, y: 2 };
    }

    level.startPos = startPos;
    level.targetPos = targetPos;

    const slopeDisplayHTML = `
      <div id="slope-value-display-wrapper" style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; padding: 0 4px;">
        <input type="number" id="input-rise-lvl3" class="cartoon-number-input" placeholder="?" style="width: 60px; padding: 4px; border: 3px solid var(--color-border); border-radius: 8px; font-family: inherit; font-weight: 700; font-size: 1.2rem; text-align: center; height: 32px; box-sizing: border-box; background: #ffffff; color: #ca8a04;" />
        <div style="background: var(--color-border); width: 50px; height: 3px; margin: 5px 0;"></div>
        <input type="number" id="input-run-lvl3" class="cartoon-number-input" placeholder="?" style="width: 60px; padding: 4px; border: 3px solid var(--color-border); border-radius: 8px; font-family: inherit; font-weight: 700; font-size: 1.2rem; text-align: center; height: 32px; box-sizing: border-box; background: #ffffff; color: #16a34a;" />
      </div>
    `;

    level.description = `
      <div style="margin-bottom: 12px;">
        <span style="font-weight: 700; font-size: 1.15rem;">Drag Sporky to red peg <strong class="highlight-coord" style="background:#fef3c7; border-color:#d97706;">(${targetPos.x}, ${targetPos.y})</strong></span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; margin-top: 12px; margin-bottom: 12px; font-family: inherit;">
        <div style="font-weight: 700; font-size: 1.35rem; color: var(--color-border); white-space: nowrap;">Slope =</div>
        ${slopeDisplayHTML}
        <div style="display: flex; flex-direction: column; justify-content: space-between; height: 76px; font-size: 0.88rem; font-weight: 700; color: #475569; padding-left: 4px; line-height: 1.2; flex: 1; min-width: 120px;">
          <div style="min-height: 32px; padding-top: 2px;">&larr; how far <span style="color: #ca8a04;">up</span> or <span style="color: #ef4444;">down</span>?</div>
          <div style="min-height: 32px; padding-top: 4px;">&larr; how far <span style="color: #ef4444;">left</span> or <span style="color: #16a34a;">right</span>?</div>
        </div>
      </div>
    `;
  } else if (currentLevelIndex === 3) {
    let attempts = 0;
    let bVal = 0;
    let riseVal = 0;
    let runVal = 1;

    while (attempts < 100) {
      attempts++;
      bVal = Math.floor(Math.random() * 7) - 3; // -3 to 3
      if (bVal === 0 && Math.random() < 0.85) continue; // Try to avoid b = 0 frequently
      
      // Weight denominator (runVal) to be 1 in 60% of cases
      if (Math.random() < 0.6) {
        runVal = 1;
      } else {
        runVal = Math.random() < 0.5 ? 2 : 3;
      }

      riseVal = Math.floor(Math.random() * 5) - 2; // -2 to 2
      if (riseVal === 0) continue;
      if (Math.abs(riseVal) === Math.abs(runVal)) continue; // Ensure rise and run are different (no equal top/bottom values)
      
      const p1 = { x: 0, y: bVal };
      const p2 = { x: runVal, y: bVal + riseVal };
      
      if (isInsideMountain(p1.x, p1.y) && isInsideMountain(p2.x, p2.y)) {
        break;
      }
    }
    
    level4State.phase = 'intercept';
    level4State.b = bVal;
    level4State.rise = riseVal;
    level4State.run = runVal;
    level4State.placedInterceptPeg = false;
    level4State.placedDestPeg = false;
    level4State.segment1Rope = null;
    level4State.segment2Rope = null;
    level4State.fullLaserLine = null;
    level4State.interceptLabel = null;
    level4State.destLabel = null;

    level.startPos = { x: 3.5, y: 4.8 };
    level.targetPos = { x: 0, y: bVal };

    const btnPlace = document.getElementById('btn-place-peg-lvl4');
    if (btnPlace) btnPlace.textContent = 'Drop Sporky';

    const eqHTML = formatEquationHTML(riseVal, runVal, bVal);
    const hintHTML = formatSlopeHintHTML(riseVal, runVal);
    level.description = `<strong style="font-size: 1.45rem; display: block; margin-top: 4px; margin-bottom: 2px;">${eqHTML}</strong>${hintHTML}<div style="margin-top: 10px; font-weight: 700; font-size: 1.05rem;">1st, drop Sporky on the <span class="rise-color">Y-intercept</span>.</div>`;
  } else if (currentLevelIndex === 4) {
    // Randomize level 5 equation
    const q1Options = [
      { p: 2, q: 1 },   // 2
      { p: -2, q: 1 },  // -2
      { p: 3, q: 1 },   // 3
      { p: -3, q: 1 }   // -3
    ];
    const otherOptions = [
      { p: 1, q: 2 },   // 0.5
      { p: -1, q: 2 },  // -0.5
      { p: 1, q: 3 },   // 1/3
      { p: 2, q: 3 },   // 2/3
      { p: -1, q: 3 },  // -1/3
      { p: -2, q: 3 }   // -2/3
    ];
    
    let chosenM = 0.5;
    let chosenB = 1;
    let targets = [];
    let attempts = 0;
    
    while (attempts < 200) {
      attempts++;
      // 60% chance of choosing a slope with denominator of 1
      const useQ1 = Math.random() < 0.6;
      const optionsList = useQ1 ? q1Options : otherOptions;
      const choice = optionsList[Math.floor(Math.random() * optionsList.length)];
      const mVal = choice.p / choice.q;
      const bVal = Math.floor(Math.random() * 7) - 3; // -3 to 3
      
      const candidateTargets = [];
      for (let x = -4; x <= 4; x++) {
        const y = mVal * x + bVal;
        const ry = Math.round(y);
        if (Math.abs(y - ry) < 0.01 && ry >= -4 && ry <= 4 && isInsideMountain(x, ry)) {
          candidateTargets.push({ x, y: ry });
        }
      }
      
      if (candidateTargets.length >= 4) {
        chosenM = mVal;
        chosenB = bVal;
        targets = candidateTargets;
        break;
      }
    }
    
    level.targetEquation = { m: chosenM, b: chosenB };
    level.generatedTargets = targets;
    
    // Pick start pos: leftmost target point
    const sorted = [...targets].sort((a, b) => a.x - b.x);
    level.startPos = sorted[0];
    
    // Generate decoys: random points inside mountain NOT on the line
    level.generatedDecoys = [];
    let decoyAttempts = 0;
    while (level.generatedDecoys.length < 4 && decoyAttempts < 100) {
      decoyAttempts++;
      const dx = Math.floor(Math.random() * 9) - 4;
      const dy = Math.floor(Math.random() * 9) - 4;
      if (!isInsideMountain(dx, dy)) continue;
      const expectedY = chosenM * dx + chosenB;
      if (Math.abs(dy - expectedY) < 0.5) continue;
      if (targets.some(t => t.x === dx && t.y === dy)) continue;
      if (level.generatedDecoys.some(d => d.x === dx && d.y === dy)) continue;
      if (dx === level.startPos.x && dy === level.startPos.y) continue;
      level.generatedDecoys.push({ x: dx, y: dy });
    }
    
    level.description = `Adjust the slope (m) and y-intercept (b) to align the laser route so it passes through all yellow target holds!`;
  } else if (currentLevelIndex === 5) {
    // Generate a random slope and y-intercept for the graph
    const possibleSlopes = [-2, -1, -0.5, 0.5, 1, 2];
    const possibleIntercepts = [-3, -2, -1, 0, 1, 2, 3];
    const chosenM = possibleSlopes[Math.floor(Math.random() * possibleSlopes.length)];
    const chosenB = possibleIntercepts[Math.floor(Math.random() * possibleIntercepts.length)];
    
    level.targetEquation = { m: chosenM, b: chosenB };
    level.description = 'Look at the graph and type the slope and y-intercept.';
  }

  // Holds and overlays already cleared above (before level-specific setup)

  // 2. Setup the wall grid lines and axes visibility
  setGridVisibility(level.showGridLines);

  // 2b. Toggle mountain and climber visibility for Level 6
  if (level.id === 6) {
    setMountainVisibility(false);
    const climberGroup = getClimberGroup();
    if (climberGroup) climberGroup.visible = false;
  } else {
    setMountainVisibility(true);
    const climberGroup = getClimberGroup();
    if (climberGroup) climberGroup.visible = true;
  }

  // 3. Create this level's holds
  level.setupHolds(sceneObj, createHold);

  // 4. Place climber at starting position (skip for Level 6 — no climber)
  if (level.id !== 6) {
    setClimberPosition(level.startPos.x, level.startPos.y);
    updateCoordinatesDisplay(level.startPos.x, level.startPos.y);
    lastSnappedPos = { x: level.startPos.x, y: level.startPos.y };
    activeDragPath = [{ x: level.startPos.x, y: level.startPos.y }];
  }

  // 5. Update HTML UI elements
  showLevelUI(level.id, level.title, level.description, level.instructionText);
  if (level.id === 2 && challenge2SolvedCount >= 4) {
    const hintBtn = document.getElementById('btn-slope-whole-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        const slopeHintDisplayEl = document.getElementById('slope-hint-display-area');
        if (slopeHintDisplayEl) {
          const riseVal = level.targetSlope.rise;
          const riseSignHTML = riseVal < 0 ? '<span style="color: #ef4444; margin-right: 1px;">-</span>' : '';
          const riseNumHTML = `<span style="color: #000000;">${Math.abs(riseVal)}</span>`;
          slopeHintDisplayEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px; margin-bottom: 12px;">
              <span style="font-size: 0.9rem; font-weight: 600; color: #64748b;">(<span style="color: #ca8a04; font-weight: 700;">up</span>/<span style="color: #ef4444; font-weight: 700;">down</span> / <span style="color: #ef4444; font-weight: 700;">left</span>/<span style="color: #16a34a; font-weight: 700;">right</span>)</span>
            </div>
          `;
        }
        hintBtn.style.display = 'none';
        const riseVal = level.targetSlope.rise;
        showToast(`Remember: any whole number is a fraction with 1 in the denominator! Slope of ${riseVal} is the same as ${riseVal}/1.`, false, 5000);
      });
    }
  }
  if (level.id === 2 && level.targetSlope) {
    setTargetSlopeDisplay(level.targetSlope.rise, level.targetSlope.run);
  }
  if (level.id === 4) {
    setTargetEquationLvl4(level4State.rise, level4State.run, level4State.b);
  }

  // Set the coordinates of the destination (stop) peg for Level 3
  if (level.id === 3) {
    setDestinationLabel(sceneObj, level.targetPos.x, level.targetPos.y, true);
  } else {
    setDestinationLabel(sceneObj, 0, 0, false);
  }

  // 6. Level specific interaction configuration
  if (level.id === 1 || level.id === 2 || level.id === 3 || level.id === 4) {
    setDragEnabled(true);
  } else if (level.id === 5) {
    setDragEnabled(false);
    updateEquationLaserOverlay(1.0, 0);
  } else if (level.id === 6) {
    setDragEnabled(false);
    // Draw the graph line for Level 6
    drawLevel6GraphLine(level.targetEquation.m, level.targetEquation.b);
  }
}

export function resetLevel() {
  loadLevel(currentLevelIndex);
}

export function shuffleTargetCoordinate() {
  const level = levels[0];
  const currentTarget = level.targetPos;
  const newTarget = getRandomTargetCoordinateExcluding(currentTarget);
  level.targetPos = newTarget;
  
  // Update holds target metadata
  const holds = getHolds();
  holds.forEach(h => {
    h.userData.isTarget = (h.userData.x === newTarget.x && h.userData.y === newTarget.y);
  });

  // Reset climber position
  setClimberPosition(0, 0);
  updateCoordinatesDisplay(0, 0);

  // Update description
  level.description = `Drag Sporky to the target peg at <span class='highlight-coord' id='target-coord-display'>(${newTarget.x}, ${newTarget.y})</span>.`;
  showLevelUI(level.id, level.title, level.description, level.instructionText);
}

export function changeLevel(dir) {
  const newIndex = currentLevelIndex + dir;
  if (newIndex >= 0 && newIndex < levels.length) {
    loadLevel(newIndex);
  }
}

// --- Snap callbacks from dragManager (Level 1) ---
export function handleClimberSnap(hold) {
  const level = levels[currentLevelIndex];
  
  if (level.id === 1) {
    updateCoordinatesDisplay(hold.userData.x, hold.userData.y);
    
    if (level.validate(hold.userData)) {
      challenge1SolvedCount++;
      
      // Unlock the Next button after the very first correct coordinate is found
      if (challenge1SolvedCount === 1) {
        levelCompleted = true;
        setNextButtonUnlocked(true);
      }
      
      const currentTarget = level.targetPos;
      const newTarget = getRandomTargetCoordinateExcluding(currentTarget);
      level.targetPos = newTarget;
      
      // Update holds target metadata
      const holds = getHolds();
      holds.forEach(h => {
        h.userData.isTarget = (h.userData.x === newTarget.x && h.userData.y === newTarget.y);
      });

      level.description = `Drag Sporky to the target peg at <span class='highlight-coord' id='target-coord-display'>(${newTarget.x}, ${newTarget.y})</span>.`;
      
      showLevelUI(level.id, level.title, level.description, level.instructionText);
      
      // Re-ensure Next button stays unlocked if solved count is >= 1
      setNextButtonUnlocked(true);
      
      registerSuccess(0, `Correct! Solved: ${challenge1SolvedCount}. Next target: (${newTarget.x}, ${newTarget.y})`);

      // Reset climber to (0, 0) with a delay so they see the landing bounce first
      setTimeout(() => {
        if (currentLevelIndex === 0) {
          setClimberPosition(0, 0);
          updateCoordinatesDisplay(0, 0);
        }
      }, 1200);
    } else {
      registerFailure(`Sporky snapped to (${hold.userData.x}, ${hold.userData.y}). Try to find (${level.targetPos.x}, ${level.targetPos.y})!`);
    }
  } else if (level.id === 2 || level.id === 3 || level.id === 4) {
    updateCoordinatesDisplay(hold.userData.x, hold.userData.y);
    const climberPos = getClimberPosition();
    if (level.id !== 4 || level4State.phase === 'slope') {
      tryExtendPath(hold.userData.x, hold.userData.y, climberPos.x, climberPos.y);
    }
    lastSnappedPos = { x: hold.userData.x, y: hold.userData.y };
    
    // Auto-validate for Level 2 once Sporky snaps to correct coordinate
    if (level.id === 2 && level.validate(hold.userData)) {
      submitSlopePosition();
    }

    // Auto-validate for Level 4 once Sporky snaps to correct coordinate in slope phase
    if (level.id === 4 && level4State.phase === 'slope') {
      const cx = hold.userData.x;
      const cy = hold.userData.y;
      const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
      const d = Math.abs(gcd(level4State.rise, level4State.run));
      const reducedRise = level4State.rise / d;
      const reducedRun = level4State.run / d;
      
      const onLine = cx !== 0 && ((cy - level4State.b) * reducedRun === reducedRise * cx);
      const correctDirection = cx > 0;
      
      if (onLine && correctDirection) {
        placePegLvl4();
      }
    }
  }
}

export function resetHoldColors() {
  const level = levels[currentLevelIndex];
  const holds = getHolds();
  holds.forEach(hold => {
    if (hold && hold.userData && hold.userData.mesh && hold.userData.mesh.material) {
      const hx = hold.userData.x;
      const hy = hold.userData.y;
      
      const isStart = hx === level.startPos.x && hy === level.startPos.y;
      const isStop = level.id === 3 && hx === level.targetPos.x && hy === level.targetPos.y;
      const isOnAxis = hx === 0 || hy === 0;
      
      let color = isOnAxis ? '#64748b' : '#cbd5e1';
      if (isStart) {
        color = '#10b981';
      } else if (isStop) {
        color = '#ef4444';
      }
      
      // Level 4 specific dynamic peg coloring
      if (level.id === 4) {
        if (level4State.placedInterceptPeg && hx === 0 && hy === level4State.b) {
          color = '#f59e0b'; // Placed y-intercept peg
        }
        if (level4State.placedDestPeg && hx === level4State.run && hy === level4State.b + level4State.rise) {
          color = '#ef4444'; // Placed destination peg
        }
      }
      
      hold.userData.mesh.material.color.set(color);
    }
  });
}

function isSubPathOfPathA(path, startX, startY, targetX, targetY) {
  const isBetween = (val, a, b) => val >= Math.min(a, b) && val <= Math.max(a, b);
  
  for (const pt of path) {
    const onH = pt.y === startY && isBetween(pt.x, startX, targetX);
    const onV = pt.x === targetX && isBetween(pt.y, startY, targetY);
    if (!onH && !onV) return false;
  }
  return true;
}

function isSubPathOfPathB(path, startX, startY, targetX, targetY) {
  const isBetween = (val, a, b) => val >= Math.min(a, b) && val <= Math.max(a, b);
  
  for (const pt of path) {
    const onV = pt.x === startX && isBetween(pt.y, startY, targetY);
    const onH = pt.y === targetY && isBetween(pt.x, startX, targetX);
    if (!onV && !onH) return false;
  }
  return true;
}

export function tryExtendPath(targetX_curr, targetY_curr, floatX, floatY) {
  const level = levels[currentLevelIndex];
  if (level.id !== 2 && level.id !== 3 && level.id !== 4) return;

  let startX = level.startPos.x;
  let startY = level.startPos.y;
  let destX = level.targetPos.x;
  let destY = level.targetPos.y;

  if (level.id === 4) {
    if (level4State.phase === 'intercept') {
      startX = 0;
      startY = 0;
      destX = 0;
      destY = level4State.b;
    } else {
      startX = 0;
      startY = level4State.b;
      // Allow dragging to any position (validated on peg placement, not during drag)
      destX = targetX_curr;
      destY = targetY_curr;
    }
  }

  // Initialize path if empty
  if (!activeDragPath || activeDragPath.length === 0) {
    activeDragPath = [{ x: startX, y: startY }];
  }

  // If we are at the start position, reset the path to just the start
  if (targetX_curr === startX && targetY_curr === startY) {
    activeDragPath = [{ x: startX, y: startY }];
    applyPathColors();
    return;
  }

  const last = activeDragPath[activeDragPath.length - 1];

  // If the target is already the last element, do nothing
  if (targetX_curr === last.x && targetY_curr === last.y) {
    return;
  }

  // Check if target is a backtracking step
  if (activeDragPath.length > 1) {
    const secondLast = activeDragPath[activeDragPath.length - 2];
    if (targetX_curr === secondLast.x && targetY_curr === secondLast.y) {
      activeDragPath.pop();
      applyPathColors();
      return;
    }
  }

  // Determine if target aligns orthogonally with last position
  const isHorizontal = targetY_curr === last.y;
  const isVertical = targetX_curr === last.x;

  if (!isHorizontal && !isVertical) {
    // If not orthogonal, check if we can resolve the corner dynamically based on climber's float position
    const cornerA = { x: targetX_curr, y: last.y }; // Horizontal first, then vertical
    const cornerB = { x: last.x, y: targetY_curr }; // Vertical first, then horizontal

    // Calculate distance from float position to both corners
    const distA = Math.sqrt((floatX - cornerA.x) ** 2 + (floatY - cornerA.y) ** 2);
    const distB = Math.sqrt((floatX - cornerB.x) ** 2 + (floatY - cornerB.y) ** 2);

    const preferredCorner = distA < distB ? cornerA : cornerB;

    // Try to extend to preferredCorner first recursively
    tryExtendPath(preferredCorner.x, preferredCorner.y, floatX, floatY);

    // After extending to the corner, try to extend to the final target
    const newLast = activeDragPath[activeDragPath.length - 1];
    if (newLast.x === preferredCorner.x && newLast.y === preferredCorner.y) {
      const isH = targetY_curr === newLast.y;
      const steps = [];
      if (isH) {
        const step = targetX_curr > newLast.x ? 1 : -1;
        for (let x = newLast.x + step; x !== targetX_curr + step; x += step) {
          steps.push({ x: x, y: newLast.y });
        }
      } else {
        const step = targetY_curr > newLast.y ? 1 : -1;
        for (let y = newLast.y + step; y !== targetY_curr + step; y += step) {
          steps.push({ x: newLast.x, y: y });
        }
      }

      const testPath = [...activeDragPath, ...steps];
      const validA = isSubPathOfPathA(testPath, startX, startY, destX, destY);
      const validB = isSubPathOfPathB(testPath, startX, startY, destX, destY);

      if (validA || validB) {
        activeDragPath.push(...steps);
        applyPathColors();
        return;
      }
    }

    // If corner resolution fails, reset to start
    activeDragPath = [{ x: startX, y: startY }];
    applyPathColors();
    return;
  }

  // Generate intermediate steps
  const steps = [];
  if (isHorizontal) {
    const step = targetX_curr > last.x ? 1 : -1;
    for (let x = last.x + step; x !== targetX_curr + step; x += step) {
      steps.push({ x: x, y: last.y });
    }
  } else {
    const step = targetY_curr > last.y ? 1 : -1;
    for (let y = last.y + step; y !== targetY_curr + step; y += step) {
      steps.push({ x: last.x, y: y });
    }
  }

  // Check if extending by these steps keeps the path as a sub-path of A or B
  const testPath = [...activeDragPath, ...steps];
  const validA = isSubPathOfPathA(testPath, startX, startY, destX, destY);
  const validB = isSubPathOfPathB(testPath, startX, startY, destX, destY);

  if (validA || validB) {
    // Valid path! Append steps
    activeDragPath.push(...steps);
    applyPathColors();
  } else {
    // If any intermediate step is off-path, reset
    activeDragPath = [{ x: startX, y: startY }];
    applyPathColors();
  }
}

function applyPathColors() {
  const level = levels[currentLevelIndex];
  
  // 1. Reset all holds to default colors
  resetHoldColors();

  if (!activeDragPath || activeDragPath.length <= 1) {
    return;
  }

  // 2. Color each hold in the active path
  for (let i = 1; i < activeDragPath.length; i++) {
    const prev = activeDragPath[i - 1];
    const curr = activeDragPath[i];
    
    // Determine movement direction for this segment
    if (curr.x !== prev.x) {
      // Horizontal segment: highlight in green
      colorHoldAt(curr.x, curr.y, '#22c55e');
      colorHoldAt(prev.x, prev.y, '#22c55e');
    } else if (curr.y !== prev.y) {
      // Vertical segment: highlight in yellow
      colorHoldAt(curr.x, curr.y, '#eab308');
      colorHoldAt(prev.x, prev.y, '#eab308');
    }
  }
}

function colorHoldAt(x, y, colorHex) {
  const holds = getHolds();
  const hold = holds.find(h => h.userData.x === x && h.userData.y === y);
  if (hold && hold.userData.mesh && hold.userData.mesh.material) {
    hold.userData.mesh.material.color.set(colorHex);
  }
}

export function handleClimberDrag(x, y) {
  // Live coordinate update during drag
  updateCoordinatesDisplay(x, y);

  const level = levels[currentLevelIndex];
  if (level.id === 2 || level.id === 3 || level.id === 4) {
    if (level.id === 4 && level4State.phase === 'intercept') {
      return; // Skip path calculation while hovering on parachute
    }
    const rx = Math.round(x);
    const ry = Math.round(y);
    const dist = Math.sqrt((x - rx) ** 2 + (y - ry) ** 2);
    // Real-time highlight updating as Sporky rolls over pegs (close snap radius)
    if (dist < 0.45) {
      tryExtendPath(rx, ry, x, y);
    }
  }
}

// --- Level 2: Slope Submit Position ---
export function submitSlopePosition() {
  if (levelCompleted) return;

  const level = levels[currentLevelIndex];
  if (level.id !== 2) return;

  const climberPos = getClimberPosition();
  if (level.validate(climberPos)) {
    challenge2SolvedCount++;
    levelCompleted = true;
    if (challenge2SolvedCount === 1) {
      setNextButtonUnlocked(true);
    }
    const expectedX = level.startPos.x + level.targetSlope.run;
    const expectedY = level.startPos.y + level.targetSlope.rise;
    registerSuccess(1, `Correct! Solved: ${challenge2SolvedCount}. Sporky reached (${expectedX}, ${expectedY})!`);

    // Draw the purple slope line connecting startPos and expectedPos
    const startPt = new THREE.Vector3(level.startPos.x, level.startPos.y, -0.10);
    const endPt = new THREE.Vector3(expectedX, expectedY, -0.10);
    
    if (ropeMesh) sceneObj.remove(ropeMesh);
    ropeMesh = createCylinderBetweenPoints(startPt, endPt, 0.06, '#8b5cf6'); // Purple slope line
    sceneObj.add(ropeMesh);

    // Calculate midpoint and show slope value label in purple
    const midX = (level.startPos.x + expectedX) / 2;
    const midY = (level.startPos.y + expectedY) / 2;
    createSlopeValueLabel(sceneObj, midX, midY, level.targetSlope.rise, level.targetSlope.run, true);

    // Auto-reset with new question after delay
    setTimeout(() => {
      if (currentLevelIndex === 1) {
        loadLevel(1, true);
        setNextButtonUnlocked(true);
      }
    }, 2000);
  } else {
    const currentX = Math.round(climberPos.x);
    const currentY = Math.round(climberPos.y);
    const expectedX = level.startPos.x + level.targetSlope.run;
    const expectedY = level.startPos.y + level.targetSlope.rise;
    registerFailure(`Incorrect! Sporky is at (${currentX}, ${currentY}). Sporky needs to go to (${expectedX}, ${expectedY}) based on starting point (${level.startPos.x}, ${level.startPos.y}) and slope rise/run = ${level.targetSlope.rise}/${level.targetSlope.run}.`);
  }
}

// --- Level 3: Slope Calculation Verification ---
export function submitLevel3Slope() {
  if (levelCompleted) return;

  const level = levels[currentLevelIndex];
  if (level.id !== 3) return;

  const riseInput = parseInt(document.getElementById('input-rise-lvl3').value, 10);
  const runInput = parseInt(document.getElementById('input-run-lvl3').value, 10);

  if (isNaN(riseInput) || isNaN(runInput)) {
    showToast("Please enter valid numbers for both Rise and Run!", true, 3000);
    return;
  }

  const climberPos = getClimberPosition();
  const validation = level.validate(riseInput, runInput, climberPos);

  if (validation.success) {
    challenge3SolvedCount++;
    levelCompleted = true;
    if (challenge3SolvedCount === 1) {
      setNextButtonUnlocked(true);
    }
    registerSuccess(2, `Correct! Solved: ${challenge3SolvedCount}. Slope is Rise/Run = ${riseInput}/${runInput}!`);

    // Auto-reset with new question after delay
    setTimeout(() => {
      if (currentLevelIndex === 2) {
        loadLevel(2, true);
        setNextButtonUnlocked(true);
      }
    }, 2000);
  } else {
    if (validation.reason === "position") {
      const currentX = Math.round(climberPos.x);
      const currentY = Math.round(climberPos.y);
      registerFailure(`Sporky is at (${currentX}, ${currentY}), but needs to reach red peg (${level.targetPos.x}, ${level.targetPos.y}) first!`);
    } else {
      registerFailure(`Incorrect slope! Calculate the rise (change in y) and run (change in x) from starting point (${level.startPos.x}, ${level.startPos.y}) to stop point (${level.targetPos.x}, ${level.targetPos.y}).`);
    }
  }
}

// Create cylinder connecting point A to point B in 3D
function createCylinderBetweenPoints(pA, pB, radius, colorHex) {
  const direction = new THREE.Vector3().subVectors(pB, pA);
  const length = direction.length();
  
  // Cylinder geometry aligned vertically, we offset and rotate it
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
  geometry.translate(0, length / 2, 0);
  geometry.rotateX(Math.PI / 2);
  
  const material = new THREE.MeshToonMaterial({
    color: colorHex,
    gradientMap: getToonGradientTexture()
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(pA);
  
  // Align cylinder along the displacement vector
  mesh.lookAt(pB);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function updateSlopeRopeOverlay(rise, run) {
  const level = levels[currentLevelIndex];
  if (level.id !== 2) return;

  // Clear previous overlays
  if (ropeMesh) sceneObj.remove(ropeMesh);
  if (riseLine) sceneObj.remove(riseLine);
  if (runLine) sceneObj.remove(runLine);

  const endX = level.startPos.x + run;
  const endY = level.startPos.y + rise;

  const startOffset = getCoordinateOffset(level.startPos.x, level.startPos.y);
  const cornerOffset = getCoordinateOffset(endX, level.startPos.y);
  const endOffset = getCoordinateOffset(endX, endY);

  const startPt = new THREE.Vector3(level.startPos.x + startOffset.x, level.startPos.y + startOffset.y, -0.10);
  const cornerPt = new THREE.Vector3(endX + cornerOffset.x, level.startPos.y + startOffset.y, -0.11);
  const endPt = new THREE.Vector3(endX + endOffset.x, endY + endOffset.y, -0.10);

  // 1. Create main climbing rope (thick orange rope)
  // Only draw if there's length
  if (startPt.distanceTo(endPt) > 0.05) {
    ropeMesh = createCylinderBetweenPoints(startPt, endPt, 0.08, '#f97316'); // Orange rope
    sceneObj.add(ropeMesh);
  }

  // 2. Create Horizontal Run helper line (Ocean Green)
  if (Math.abs(run) > 0.05) {
    runLine = createCylinderBetweenPoints(startPt, cornerPt, 0.04, '#22c55e'); // Green run
    sceneObj.add(runLine);
  }

  // 3. Create Vertical Rise helper line (Vibrant Yellow)
  if (Math.abs(rise) > 0.05) {
    riseLine = createCylinderBetweenPoints(cornerPt, endPt, 0.04, '#eab308'); // Yellow rise
    sceneObj.add(riseLine);
  }
}

// --- Level 3: Slope-Intercept Route Setter Verification ---
export function testRoute() {
  if (levelCompleted) return;

  const level = levels[currentLevelIndex];
  const { m, b } = getLevel3Inputs();

  // Validate math
  if (level.validate(m, b)) {
    // Build route from generated targets, sorted left to right
    const targets = level.generatedTargets || [
      { x: -2, y: 0 },
      { x: 0, y: 1 },
      { x: 2, y: 2 },
      { x: 4, y: 3 }
    ];
    const routePoints = [...targets].sort((a, b) => a.x - b.x);
    hopSequence(routePoints, 0);
  } else {
    registerFailure("Route invalid! The line doesn't align with all yellow targets.");
  }
}

function hopSequence(points, index) {
  if (index >= points.length) {
    levelCompleted = true;
    const eq = levels[currentLevelIndex].targetEquation || { m: 0.5, b: 1 };
    
    if (currentLevelIndex === 4) {
      challenge5SolvedCount++;
      registerSuccess(4, `Splendid! Solved: ${challenge5SolvedCount}. The line y = ${eq.m}x + ${eq.b} connects all targets!`);
      if (challenge5SolvedCount === 1) {
        setNextButtonUnlocked(true);
      }
      setTimeout(() => {
        if (currentLevelIndex === 4) {
          loadLevel(4, true);
          setNextButtonUnlocked(true);
        }
      }, 2500);
    } else if (currentLevelIndex === 5) {
      challenge6SolvedCount++;
      registerSuccess(5, `Splendid! Solved: ${challenge6SolvedCount}. The equation representing the problem is y = ${eq.m}x + ${eq.b}!`);
      if (challenge6SolvedCount === 1) {
        setNextButtonUnlocked(true);
      }
      setTimeout(() => {
        if (currentLevelIndex === 5) {
          loadLevel(5, true);
          setNextButtonUnlocked(true);
        }
      }, 2500);
    }
    return;
  }

  const nextPt = points[index];
  animateToPosition(nextPt.x, nextPt.y, 0.4, () => {
    // Flash target holds when landed on
    const holds = getHolds();
    holds.forEach(hold => {
      if (hold.userData.x === nextPt.x && hold.userData.y === nextPt.y) {
        hold.userData.mesh.scale.set(1.5, 1.5, 1.5);
        setTimeout(() => hold.userData.mesh.scale.set(1, 1, 1), 200);
      }
    });

    // Recursively trigger next hop
    setTimeout(() => {
      hopSequence(points, index + 1);
    }, 150);
  });
}

function updateLevel5InterceptLabel(x, y, text, colorHex) {
  if (level5InterceptLabel) {
    sceneObj.remove(level5InterceptLabel);
    if (level5InterceptLabel.material.map) level5InterceptLabel.material.map.dispose();
    level5InterceptLabel.material.dispose();
    level5InterceptLabel = null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.font = 'bold 30px Fredoka, sans-serif';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = colorHex;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  
  const textWidth = ctx.measureText(text).width;
  const startX = (canvas.width - textWidth) / 2;
  const centerY = canvas.height / 2;

  ctx.strokeText(text, startX, centerY);
  ctx.fillText(text, startX, centerY);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  level5InterceptLabel = new THREE.Sprite(material);

  level5InterceptLabel.position.set(x, y + 0.45, -0.05);
  level5InterceptLabel.scale.set(1.4, 0.70, 1);

  sceneObj.add(level5InterceptLabel);
}

function updateLevel5SlopeLabel(x, y, text, m) {
  if (level5SlopeLabel) {
    sceneObj.remove(level5SlopeLabel);
    if (level5SlopeLabel.material.map) level5SlopeLabel.material.map.dispose();
    level5SlopeLabel.material.dispose();
    level5SlopeLabel = null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.font = 'bold 36px Fredoka, sans-serif';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#8b5cf6'; // Purple color
  ctx.strokeStyle = '#1e293b'; // Dark outline
  ctx.lineWidth = 6;
  
  const textWidth = ctx.measureText(text).width;
  const startX = (canvas.width - textWidth) / 2;
  const centerY = canvas.height / 2;

  ctx.strokeText(text, startX, centerY);
  ctx.fillText(text, startX, centerY);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  material.rotation = Math.atan(m);

  level5SlopeLabel = new THREE.Sprite(material);
  level5SlopeLabel.position.set(x, y, -0.05);
  level5SlopeLabel.scale.set(1.4, 0.70, 1);

  sceneObj.add(level5SlopeLabel);
}

function updateEquationLaserOverlay(m, b) {
  const level = levels[currentLevelIndex];
  if (level.id !== 5) return;

  if (laserLineMesh) sceneObj.remove(laserLineMesh);

  // Define endpoints of line spanning the wall width (from x = -5.5 to x = 5.5)
  const x1 = -5.5;
  const y1 = m * x1 + b;
  const x2 = 5.5;
  const y2 = m * x2 + b;

  const pA = new THREE.Vector3(x1, y1, -0.11);
  const pB = new THREE.Vector3(x2, y2, -0.11);

  // Create neon laser beam (purple)
  laserLineMesh = createCylinderBetweenPoints(pA, pB, 0.05, '#a78bfa'); // Translucent purple laser
  sceneObj.add(laserLineMesh);

  // 1. Remove previous Level 5 dynamic objects
  if (level5InterceptDot) {
    sceneObj.remove(level5InterceptDot);
    level5InterceptDot.geometry.dispose();
    level5InterceptDot.material.dispose();
    level5InterceptDot = null;
  }
  
  // 2. Create yellow y-intercept dot
  const dotGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const dotMat = new THREE.MeshToonMaterial({
    color: '#eab308', // Yellow matching rise-color
    gradientMap: getToonGradientTexture()
  });
  level5InterceptDot = new THREE.Mesh(dotGeo, dotMat);
  level5InterceptDot.position.set(0, b, -0.09);
  level5InterceptDot.castShadow = true;
  level5InterceptDot.receiveShadow = true;
  sceneObj.add(level5InterceptDot);

  // 3. Update intercept coordinates label
  updateLevel5InterceptLabel(0, b, `(0, ${b})`, '#eab308');

  // 4. Find best X position for slope label to keep it on the wall
  let slopeX = 2.0;
  let slopeY = m * slopeX + b;
  if (slopeY < -4 || slopeY > 4) {
    slopeX = -2.0;
    slopeY = m * slopeX + b;
    if (slopeY < -4 || slopeY > 4) {
      slopeX = 1.0;
      slopeY = m * slopeX + b;
      if (slopeY < -4 || slopeY > 4) {
        slopeX = -1.0;
        slopeY = m * slopeX + b;
      }
    }
  }

  // 5. Offset perpendicular to the slope to place it on top of the line
  const theta = Math.atan(m);
  const offsetD = 0.45;
  const offsetX = -Math.sin(theta) * offsetD;
  const offsetY = Math.cos(theta) * offsetD;

  updateLevel5SlopeLabel(
    slopeX + offsetX,
    slopeY + offsetY,
    `m = ${m.toFixed(2)}`,
    m
  );

  // Update target holds states: if they lie on the current line, light them up!
  const holds = getHolds();
  holds.forEach(hold => {
    const hx = hold.userData.x;
    const hy = hold.userData.y;

    if (hold.userData.isTarget) {
      // Check equation match (y = mx + b)
      const expectedY = m * hx + b;
      
      // Floating point check
      if (Math.abs(hy - expectedY) < 0.05) {
        // Correctly intersected target - change color to bright green
        hold.userData.mesh.material.color.set('#22c55e');
        hold.userData.mesh.scale.set(1.15, 1.15, 1.15);
      } else {
        // Reset to original gold color
        hold.userData.mesh.material.color.set('#f59e0b');
        hold.userData.mesh.scale.set(1, 1, 1);
      }
    }
  });
}

export function placePegLvl4() {
  if (levelCompleted) return;

  const level = levels[currentLevelIndex];
  if (level.id !== 4) return;

  const climberPos = getClimberPosition();
  const cx = Math.round(climberPos.x);
  const cy = Math.round(climberPos.y);

  if (level4State.phase === 'intercept') {
    if (cx === 0 && cy === level4State.b) {
      level4State.placedInterceptPeg = true;
      playSuccessSound();
      setClimberExpression('happy', 2.0);
      
      const hold = getHolds().find(h => h.userData.x === 0 && h.userData.y === level4State.b);
      if (hold) {
        hold.userData.mesh.material.color.set('#f59e0b');
        hold.userData.mesh.scale.set(1.3, 1.3, 1.3);
      }
      
      level4State.interceptLabel = createSignLabel(sceneObj, 0, level4State.b, `y-int: (0, ${level4State.b})`, '#f59e0b');

      setClimberHovering(false);

      level4State.phase = 'slope';
      level.startPos = { x: 0, y: level4State.b };
      level.targetPos = { x: level4State.run, y: level4State.b + level4State.rise };
      
      activeDragPath = [{ x: 0, y: level4State.b }];
      lastSnappedPos = { x: 0, y: level4State.b };
      
      resetHoldColors();
      
      const eqHTML = formatEquationHTML(level4State.rise, level4State.run, level4State.b);
      const hintHTML = formatSlopeHintHTML(level4State.rise, level4State.run);
      level.description = `<strong style="font-size: 1.45rem; display: block; margin-top: 4px; margin-bottom: 2px;">${eqHTML}</strong>${hintHTML}<div style="margin-top: 10px; font-weight: 700; font-size: 1.05rem;">2nd, use the slope in the equation to move Sporky.</div>`;
      showLevelUI(level.id, level.title, level.description, level.instructionText);

      const btnPlace = document.getElementById('btn-place-peg-lvl4');
      if (btnPlace) btnPlace.textContent = 'Place Peg';

      showToast(`Placed y-intercept peg! Now follow the slope.`);
    } else {
      registerFailure(`Incorrect y-intercept! Drag Sporky to the y-intercept at (0, ${level4State.b}) and click Drop Sporky.`);
    }
  } else if (level4State.phase === 'slope') {
    // Accept ANY valid grid point on the line (not just one hardcoded destination)
    // A point (cx, cy) is valid if:
    // 1. cx !== 0 (must move away from y-intercept)
    // 2. The point lies on the line: cy = (rise/run)*cx + b
    // We check with cross-multiplication to avoid float issues: cy - b = (rise * cx) / run
    // => (cy - b) * run === rise * cx
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    const d = Math.abs(gcd(level4State.rise, level4State.run));
    const reducedRise = level4State.rise / d;
    const reducedRun = level4State.run / d;
    
    const onLine = cx !== 0 && ((cy - level4State.b) * reducedRun === reducedRise * cx);
    // Also ensure they moved in the correct direction (positive run)
    const correctDirection = cx > 0;
    
    if (onLine && correctDirection) {
      challenge4SolvedCount++;
      level4State.placedDestPeg = true;
      registerSuccess(3, `Excellent! Solved: ${challenge4SolvedCount}. Equation line formed!`);

      const hold = getHolds().find(h => h.userData.x === cx && h.userData.y === cy);
      if (hold) {
        hold.userData.mesh.material.color.set('#ef4444');
        hold.userData.mesh.scale.set(1.3, 1.3, 1.3);
      }
      
      level4State.destLabel = createSignLabel(sceneObj, cx, cy, `Dest: (${cx}, ${cy})`, '#ef4444');
      
      level4State.segment2Rope = createCylinderBetweenPoints(
        new THREE.Vector3(0, level4State.b, -0.1),
        new THREE.Vector3(cx, cy, -0.1),
        0.05,
        '#f97316'
      );
      sceneObj.add(level4State.segment2Rope);

      const slopeM = reducedRise / reducedRun;
      const x1 = -5.5;
      const y1 = slopeM * x1 + level4State.b;
      const x2 = 5.5;
      const y2 = slopeM * x2 + level4State.b;
      
      level4State.fullLaserLine = createCylinderBetweenPoints(
        new THREE.Vector3(x1, y1, -0.11),
        new THREE.Vector3(x2, y2, -0.11),
        0.06,
        '#a78bfa'
      );
      sceneObj.add(level4State.fullLaserLine);

      level4State.phase = 'completed';
      levelCompleted = true;
      if (challenge4SolvedCount === 1) {
        setNextButtonUnlocked(true);
      }
      
      resetHoldColors();

      // Auto-reset with new question after delay
      setTimeout(() => {
        if (currentLevelIndex === 3) {
          loadLevel(3, true);
          setNextButtonUnlocked(true);
        }
      }, 2500);
    } else {
      // Show hint with reduced fraction
      const hintX = reducedRun;
      const hintY = level4State.b + reducedRise;
      registerFailure(`Incorrect destination! Follow the slope rise/run = ${reducedRise}/${reducedRun} from (0, ${level4State.b}) to reach a point like (${hintX}, ${hintY}).`);
    }
  }
}

// --- Level 6: Draw a static graph line with plotted dots ---
function drawLevel6GraphLine(m, b) {
  // Remove previous level 6 graph objects
  clearLevel6Graph();

  // Draw the line spanning the full grid
  const x1 = -5.5;
  const y1 = m * x1 + b;
  const x2 = 5.5;
  const y2 = m * x2 + b;

  const pA = new THREE.Vector3(x1, y1, -0.11);
  const pB = new THREE.Vector3(x2, y2, -0.11);

  level6GraphLine = createCylinderBetweenPoints(pA, pB, 0.05, '#a78bfa'); // Purple line
  sceneObj.add(level6GraphLine);

  // Plot dots at integer x coordinates where y is also integer and within grid
  for (let x = -5; x <= 5; x++) {
    const y = m * x + b;
    const ry = Math.round(y);
    if (Math.abs(y - ry) < 0.01 && ry >= -5 && ry <= 5) {
      const dotGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const dotMat = new THREE.MeshToonMaterial({
        color: '#eab308', // Yellow
        gradientMap: getToonGradientTexture()
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, ry, -0.08);
      dot.castShadow = true;
      sceneObj.add(dot);
      level6GraphDots.push(dot);
    }
  }
}

function clearLevel6Graph() {
  if (level6GraphLine) {
    sceneObj.remove(level6GraphLine);
    if (level6GraphLine.geometry) level6GraphLine.geometry.dispose();
    if (level6GraphLine.material) level6GraphLine.material.dispose();
    level6GraphLine = null;
  }
  level6GraphDots.forEach(dot => {
    sceneObj.remove(dot);
    if (dot.geometry) dot.geometry.dispose();
    if (dot.material) dot.material.dispose();
  });
  level6GraphDots = [];
}

export function submitLevel6Answer(mStr, bStr) {
  const level = levels[currentLevelIndex];
  if (level.id !== 6) return;

  // Parse the user's input — accept fractions like "1/2" or decimals like "0.5"
  const parseInput = (str) => {
    str = str.trim();
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
      }
    }
    return parseFloat(str);
  };

  const mVal = parseInput(mStr);
  const bVal = parseInput(bStr);

  if (isNaN(mVal) || isNaN(bVal)) {
    showToast('Please enter valid numbers for slope and y-intercept.', true, 3000);
    return;
  }

  const target = level.targetEquation;
  if (Math.abs(mVal - target.m) < 0.01 && Math.abs(bVal - target.b) < 0.01) {
    challenge6SolvedCount++;
    registerSuccess(5, '✅ Correct! Great job reading the graph!');
    setNextButtonUnlocked(true);
    
    // Generate a new problem after a short delay
    setTimeout(() => {
      loadLevel(currentLevelIndex, true);
    }, 2500);
  } else {
    registerFailure('❌ Not quite. Look at the graph and try again.');
  }
}

// Clean up WebGL overlays
function clearOverlays() {
  if (ropeMesh) { sceneObj.remove(ropeMesh); ropeMesh = null; }
  if (riseLine) { sceneObj.remove(riseLine); riseLine = null; }
  if (runLine) { sceneObj.remove(runLine); runLine = null; }
  if (laserLineMesh) { sceneObj.remove(laserLineMesh); laserLineMesh = null; }
  if (level4State.segment1Rope) { sceneObj.remove(level4State.segment1Rope); level4State.segment1Rope = null; }
  if (level4State.segment2Rope) { sceneObj.remove(level4State.segment2Rope); level4State.segment2Rope = null; }
  if (level4State.fullLaserLine) { sceneObj.remove(level4State.fullLaserLine); level4State.fullLaserLine = null; }
  if (level4State.interceptLabel) { sceneObj.remove(level4State.interceptLabel); level4State.interceptLabel = null; }
  if (level4State.destLabel) { sceneObj.remove(level4State.destLabel); level4State.destLabel = null; }
  if (level5InterceptDot) {
    sceneObj.remove(level5InterceptDot);
    level5InterceptDot.geometry.dispose();
    level5InterceptDot.material.dispose();
    level5InterceptDot = null;
  }
  if (level5InterceptLabel) {
    sceneObj.remove(level5InterceptLabel);
    if (level5InterceptLabel.material.map) level5InterceptLabel.material.map.dispose();
    level5InterceptLabel.material.dispose();
    level5InterceptLabel = null;
  }
  if (level5SlopeLabel) {
    sceneObj.remove(level5SlopeLabel);
    if (level5SlopeLabel.material.map) level5SlopeLabel.material.map.dispose();
    level5SlopeLabel.material.dispose();
    level5SlopeLabel = null;
  }
  // Level 6 cleanup
  clearLevel6Graph();
}

export async function registerSuccess(index, successMsg) {
  const result = await incrementSolvedCount(index);
  updateSolvedCount(index);
  triggerFlyingCoinAnimation();
  playSuccessSound();
  setClimberExpression('happy', 2.0);
  updateStreakDisplay(result.newStreak);
  
  let rewardMsg = `Earned <strong>$${result.baseReward}</strong>!`;
  if (result.streakBonus > 0) {
    rewardMsg += ` 🔥 <strong>$${result.streakBonus}</strong> Streak Bonus!`;
  }
  showToast(`${successMsg}<br/><span style="font-size: 0.95rem; font-weight: 700; color: #eab308;">${rewardMsg}</span>`);
}

export function registerFailure(toastMessage) {
  const result = registerIncorrectAnswer();
  updateStreakDisplay(result.newStreak);
  updateCoinDisplays();
  playFailureSound();
  setClimberExpression('sad', 2.5);
  showToast(`${toastMessage}<br/><span style="font-size: 0.9rem; font-weight: 700; color: #ef4444;">Streak reset! Lost $1.</span>`, true, 4000);
}
