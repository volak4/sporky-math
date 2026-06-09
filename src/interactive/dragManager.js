import * as THREE from 'three';
import { getHolds, getCoordinateOffset } from '../engine/wall.js';
import { setDragStretch, triggerSquish, setClimberPosition, animateToPosition, setDraggingState } from '../engine/climber.js';
import { playHorizontalTick, playVerticalTick } from '../engine/audio.js';

let isDragging = false;
let dragEnabled = true;
let startHold = null; // The hold we started dragging from
let canvasEl, cameraObj, climberGroupObj;
let onSnapCallback = null;
let onDragCallback = null;
let lastTickX = null;
let lastTickY = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const intersection = new THREE.Vector3();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Wall plane Z=0
const previousPos = new THREE.Vector3();
const dragStartPos = new THREE.Vector3();
let dragAxis = null; // 'x' or 'y' or null to restrict dragging orthogonally

export function initDragManager(canvas, camera, climberGroup, callbacks = {}) {
  canvasEl = canvas;
  cameraObj = camera;
  climberGroupObj = climberGroup;
  
  onSnapCallback = callbacks.onSnap || null;
  onDragCallback = callbacks.onDrag || null;

  // Touch and Mouse listeners
  canvasEl.addEventListener('mousedown', onPointerDown, { passive: false });
  canvasEl.addEventListener('mousemove', onPointerMove, { passive: false });
  window.addEventListener('mouseup', onPointerUp, { passive: false });

  canvasEl.addEventListener('touchstart', onPointerDown, { passive: false });
  canvasEl.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp, { passive: false });
}

export function setDragEnabled(enabled) {
  dragEnabled = enabled;
  if (!enabled && isDragging) {
    cancelDrag();
  }
}

function getPointerNDC(e) {
  const rect = canvasEl.getBoundingClientRect();
  let clientX, clientY;

  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  // Calculate normalized device coordinates (-1 to +1)
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  return new THREE.Vector2(x, y);
}

function onPointerDown(e) {
  if (!dragEnabled) return;
  
  const ndc = getPointerNDC(e);
  mouse.copy(ndc);
  
  raycaster.setFromCamera(mouse, cameraObj);
  
  if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
    const climberPos = climberGroupObj.position;
    const clickDist = intersection.distanceTo(climberPos);

    // If click is close to the climber (radius 0.7 units)
    if (clickDist < 0.75) {
      // Prevent scrolling on touch devices
      if (e.cancelable) e.preventDefault();
      
      isDragging = true;
      previousPos.copy(climberPos);
      dragStartPos.copy(climberPos);
      dragAxis = null;
      setDraggingState(true, dragStartPos);
      lastTickX = Math.round(climberPos.x);
      lastTickY = Math.round(climberPos.y);
      
      // Find the hold the climber is currently resting on
      const holds = getHolds();
      let nearestHold = null;
      let minDist = 0.5; // close threshold
      
      holds.forEach(hold => {
        const offset = getCoordinateOffset(hold.userData.x, hold.userData.y);
        const holdPos = new THREE.Vector3(hold.userData.x + offset.x, hold.userData.y + offset.y, 0);
        const d = climberPos.distanceTo(holdPos);
        if (d < minDist) {
          minDist = d;
          nearestHold = hold;
        }
      });
      
      startHold = nearestHold;
    }
  }
}

function onPointerMove(e) {
  if (!isDragging || !dragEnabled) return;
  
  // Prevent scrolling on touch devices
  if (e.cancelable) e.preventDefault();

  const ndc = getPointerNDC(e);
  mouse.copy(ndc);

  raycaster.setFromCamera(mouse, cameraObj);

  if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
    // Limit bounds so slime can't be dragged off wall screen
    intersection.x = Math.max(-5.8, Math.min(5.8, intersection.x));
    intersection.y = Math.max(-5.8, Math.min(5.8, intersection.y));
    
    // Constrain dragging to only horizontal or vertical movement from current anchor position
    let dx = intersection.x - dragStartPos.x;
    let dy = intersection.y - dragStartPos.y;
    
    // Breakout check: if they pull the cursor far from the current locked axis, break the lock
    if (dragAxis === 'x' && Math.abs(dy) > 0.5) {
      dragAxis = null;
    } else if (dragAxis === 'y' && Math.abs(dx) > 0.5) {
      dragAxis = null;
    }

    dx = intersection.x - dragStartPos.x;
    dy = intersection.y - dragStartPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dragAxis === null) {
      if (dist > 0.15) {
        if (Math.abs(dx) > Math.abs(dy)) {
          dragAxis = 'x';
        } else {
          dragAxis = 'y';
        }
      }
    }
    
    if (dragAxis === 'x') {
      intersection.y = dragStartPos.y;
    } else if (dragAxis === 'y') {
      intersection.x = dragStartPos.x;
    } else {
      intersection.copy(dragStartPos);
    }
    
    // Drag climber to cursor position
    climberGroupObj.position.copy(intersection);

    // Calculate stretch displacement from the dragging motion
    const dxStretch = intersection.x - previousPos.x;
    const dyStretch = intersection.y - previousPos.y;
    setDragStretch(dxStretch, dyStretch);
    previousPos.copy(intersection);

    // Play tick sounds when crossing coordinate intervals
    const roundedX = Math.round(intersection.x);
    const roundedY = Math.round(intersection.y);
    if (Math.abs(dx) > Math.abs(dy)) {
      if (roundedX !== lastTickX) {
        playHorizontalTick();
        lastTickX = roundedX;
      }
    } else {
      if (roundedY !== lastTickY) {
        playVerticalTick();
        lastTickY = roundedY;
      }
    }

    // Dynamic Anchor Updating: if climber gets close to a hold, update the anchor point.
    // This allows turning corners (changing from horizontal to vertical drag) dynamically.
    const holds = getHolds();
    let hoveredHold = null;
    let minDist = 0.65;
    
    holds.forEach(hold => {
      const offset = getCoordinateOffset(hold.userData.x, hold.userData.y);
      const holdPos = new THREE.Vector3(hold.userData.x + offset.x, hold.userData.y + offset.y, 0);
      
      // Check distance from climber position to update anchor
      const dClimber = climberGroupObj.position.distanceTo(holdPos);
      if (dClimber < 0.35) {
        if (dragStartPos.distanceTo(holdPos) > 0.1) {
          dragStartPos.copy(holdPos);
          dragAxis = null; // Unlock axis for turning corners!
          setDraggingState(true, dragStartPos);
        }
      }

      // Check distance from cursor intersection for hover pulsing
      const dCursor = intersection.distanceTo(holdPos);
      if (dCursor < minDist) {
        minDist = dCursor;
        hoveredHold = hold;
      }
      
      // Reset scale of all holds
      hold.userData.mesh.scale.set(1, 1, 1);
    });

    // Pulse/scale up hovered hold
    if (hoveredHold) {
      hoveredHold.userData.mesh.scale.set(1.25, 1.25, 1.25);
    }
    
    if (onDragCallback) {
      onDragCallback(intersection.x, intersection.y);
    }
  }
}

function onPointerUp(e) {
  if (!isDragging) return;
  isDragging = false;
  setDraggingState(false);

  const climberPos = climberGroupObj.position;
  const holds = getHolds();
  
  let nearestHold = null;
  let minDist = 0.65; // Snapping radius

  holds.forEach(hold => {
    const offset = getCoordinateOffset(hold.userData.x, hold.userData.y);
    const holdPos = new THREE.Vector3(hold.userData.x + offset.x, hold.userData.y + offset.y, 0);
    const d = climberPos.distanceTo(holdPos);
    if (d < minDist) {
      minDist = d;
      nearestHold = hold;
    }
    
    // Reset all hold scales
    hold.userData.mesh.scale.set(1, 1, 1);
  });

  if (nearestHold) {
    // Snap Sporky to hold!
    setClimberPosition(nearestHold.userData.x, nearestHold.userData.y);
    triggerSquish(0.4);
    
    if (onSnapCallback) {
      onSnapCallback(nearestHold);
    }
  } else {
    // No hold found nearby, cancel drag and spring back
    cancelDrag();
  }
}

function cancelDrag() {
  isDragging = false;
  setDraggingState(false);
  // Reset all hold scales
  getHolds().forEach(hold => hold.userData.mesh.scale.set(1, 1, 1));
  
  if (startHold) {
    // Smoothly animate back to start position
    animateToPosition(startHold.userData.x, startHold.userData.y, 0.3, () => {
      if (onDragCallback) {
        onDragCallback(startHold.userData.x, startHold.userData.y);
      }
    });
  } else {
    // Fallback to origin
    animateToPosition(0, 0, 0.3, () => {
      if (onDragCallback) {
        onDragCallback(0, 0);
      }
    });
  }
}
