import * as THREE from 'three';
import { initScene } from './engine/scene.js';
import { initUI } from './interactive/uiController.js';
import { initGame, handleClimberSnap, handleClimberDrag, getGameState, loadLevel } from './levels/gameManager.js';
import { initDragManager } from './interactive/dragManager.js';
import { getClimberGroup, updateClimber, setClimberPosition } from './engine/climber.js';
import { getHolds, updateCoordinateLabel, isInsideMountain } from './engine/wall.js';
import { initNavigation } from './interactive/navigation.js';
import { initWelcomeSporky, stopWelcomeSporky } from './engine/welcomeSporky.js';
import './style.css'; // Load stylesheet

// Select canvas container
const container = document.getElementById('canvas-container');

if (container) {
  // Initialize navigation (screens, swatches, modals)
  initNavigation();

  // Initialize the 3D Welcome Sporky on the homepage
  const welcomeSporkyContainer = document.getElementById('welcome-sporky-container');
  if (welcomeSporkyContainer) {
    initWelcomeSporky(welcomeSporkyContainer);
  }

  // 1. Initialize WebGL Viewport
  const { scene, camera, renderer } = initScene(container);

  // 2. Mount HTML DOM event listeners and panels
  initUI();

  // 3. Populate persistent assets and initialize level state
  initGame(scene, camera);

  // 4. Hook climber to mouse and touch drag events
  const climber = getClimberGroup();
  initDragManager(renderer.domElement, camera, climber, {
    onSnap: (hold) => handleClimberSnap(hold),
    onDrag: (x, y) => handleClimberDrag(x, y)
  });

  // 5. Game Loop
  let lastTime = performance.now();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const time = performance.now();
    const dt = Math.min((time - lastTime) / 1000, 0.1); // cap dt to avoid physics glitches on lag spikes
    lastTime = time;

    // Update spring-decay squish physics and hop translations
    updateClimber(dt);

    // Update 3D coordinate label right beneath the closest peg the climber is on/near
    const climberGroup = getClimberGroup();
    if (climberGroup) {
      const climberPos = climberGroup.position;
      const rx = Math.round(climberPos.x);
      const ry = Math.round(climberPos.y);
      const dist = Math.sqrt((climberPos.x - rx) ** 2 + (climberPos.y - ry) ** 2);

      // Check if climber is close to a peg and peg is within mountain face
      if (isInsideMountain(rx, ry) && dist < 0.60) {
        updateCoordinateLabel(scene, rx, ry, true);
      } else {
        updateCoordinateLabel(scene, rx, ry, false);
      }
    }

    // Render viewport
    renderer.render(scene, camera);
  }

  animate();

  // Expose global test hooks for browser automation and verification
  window.__CLIMB_GAME__ = {
    getGameState,
    loadLevel,
    setClimberPosition,
    getClimberGroup,
    triggerSnap: (x, y) => {
      const holds = getHolds();
      const hold = holds.find(h => h.userData.x === x && h.userData.y === y);
      if (hold) {
        setClimberPosition(x, y);
        handleClimberSnap(hold);
      }
    }
  };
}
