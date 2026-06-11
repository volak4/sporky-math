import * as THREE from 'three';
import { getToonGradientTexture, getCoordinateOffset } from './wall.js';


let climberGroup;
let bodyMesh;
let leftEye, rightEye;
let leftPupil, rightPupil;
let mouthMesh, neutralMouthMesh;
let leftEyebrow, rightEyebrow;
let currentExpression = 'neutral';
let expressionTimer = 0;

// Limb and Paw meshes for procedural animation
let leftArmMesh, rightArmMesh, leftLegMesh, rightLegMesh;
let leftHandMesh, rightHandMesh, leftFootMesh, rightFootMesh;
let worldLeftHand = new THREE.Vector3();
let worldRightHand = new THREE.Vector3();
let worldLeftFoot = new THREE.Vector3();
let worldRightFoot = new THREE.Vector3();
let totalElapsedTime = 0;

const selectedCharacter = 'slimey';

let isDraggingClimber = false;
let dragStartAnchor = new THREE.Vector3();

export function setDraggingState(dragging, anchorWorldPos = null) {
  isDraggingClimber = dragging;
  if (dragging && anchorWorldPos) {
    dragStartAnchor.copy(anchorWorldPos);
  }
}

// Base offsets relative to body center when idle
const baseLeftHand = new THREE.Vector3(-0.45, 0.20, 0.22);
const baseRightHand = new THREE.Vector3(0.45, 0.20, 0.22);
const baseLeftFoot = new THREE.Vector3(-0.28, -0.32, 0.22);
const baseRightFoot = new THREE.Vector3(0.28, -0.32, 0.22);

// Joint anchors on the body mesh (shoulder and hip coordinates)
const leftShoulder = new THREE.Vector3(-0.18, 0.08, 0.15);
const rightShoulder = new THREE.Vector3(0.18, 0.08, 0.15);
const leftHip = new THREE.Vector3(-0.15, -0.15, 0.15);
const rightHip = new THREE.Vector3(0.15, -0.15, 0.15);

// Animation state variables
let position = new THREE.Vector3(0, 0, 0);
let targetPosition = new THREE.Vector3(0, 0, 0);
let isAnimating = false;
let animationTime = 0;
let animationDuration = 0.5; // seconds
let startPosition = new THREE.Vector3(0, 0, 0);
let onAnimComplete = null;

// Spring-damping squish physics state
let squishY = 1.0;
let squishX = 1.0;
let springTime = 0;
let springAmplitude = 0;
let springFrequency = 18;
let springDecay = 6;

// Helper to orient and scale a cylinder between a joint and hand/foot
function updateLimb(limbMesh, jointLocal, handLocal) {
  limbMesh.position.copy(jointLocal);
  const dir = new THREE.Vector3().subVectors(handLocal, jointLocal);
  const len = dir.length();
  
  // Set Y scale of cylinder to distance (length axis was rotated to Z)
  limbMesh.scale.set(1, 1, len || 0.001);
  
  // Convert local target to world space for lookAt
  const worldTarget = handLocal.clone();
  limbMesh.parent.localToWorld(worldTarget);
  limbMesh.lookAt(worldTarget);
}

function disposeMeshTree(object) {
  if (!object) return;
  object.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}

function buildCharacter(scene) {
  const toonGradient = getToonGradientTexture();

  if (selectedCharacter === 'slimey') {
    // 1. Cute Slime Body (squashed sphere)
    const bodyGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const bodyMat = new THREE.MeshToonMaterial({
      color: '#06b6d4', // Vibrant Cyan Slime
      gradientMap: toonGradient
    });
    bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.scale.set(1.05, 0.9, 0.85); // Natural slime sag
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    climberGroup.add(bodyMesh);

    // 2. Eye Whites
    const eyeWhiteGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    
    leftEye = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    leftEye.position.set(-0.14, 0.12, 0.28);
    bodyMesh.add(leftEye);

    rightEye = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    rightEye.position.set(0.14, 0.12, 0.28);
    bodyMesh.add(rightEye);

    // 3. Black Pupils
    const pupilGeo = new THREE.SphereGeometry(0.045, 10, 10);
    const pupilMat = new THREE.MeshBasicMaterial({ color: '#0f172a' });

    leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.14, 0.12, 0.35);
    bodyMesh.add(leftPupil);

    rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.14, 0.12, 0.35);
    bodyMesh.add(rightPupil);

    // 4. Happy Open Cartoon Mouth (torus) & Neutral Straight Mouth (box)
    const mouthGeo = new THREE.TorusGeometry(0.06, 0.02, 6, 12, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
    mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.position.set(0, -0.05, 0.38);
    mouthMesh.rotation.set(0, 0, Math.PI); // rotate to form smile curve
    mouthMesh.visible = false; // Hidden initially
    bodyMesh.add(mouthMesh);

    const neutralMouthGeo = new THREE.BoxGeometry(0.08, 0.015, 0.02);
    const neutralMouthMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
    neutralMouthMesh = new THREE.Mesh(neutralMouthGeo, neutralMouthMat);
    neutralMouthMesh.position.set(0, -0.05, 0.38);
    neutralMouthMesh.visible = true; // Shown initially
    bodyMesh.add(neutralMouthMesh);

    // 4.5. Eyebrows for expressions
    const eyebrowGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
    const eyebrowMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });

    leftEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMat);
    leftEyebrow.position.set(-0.14, 0.22, 0.38);
    bodyMesh.add(leftEyebrow);

    rightEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMat);
    rightEyebrow.position.set(0.14, 0.22, 0.38);
    bodyMesh.add(rightEyebrow);

    // 5. Procedural Limbs & Paws
    // Unit cylinder geometry for limbs: pointing along Z, base at (0,0,0)
    const limbGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.0, 6);
    limbGeo.translate(0, 0.5, 0);
    limbGeo.rotateX(Math.PI / 2);

    // Paw spheres (made slightly larger and more cartoonish)
    const pawGeo = new THREE.SphereGeometry(0.09, 12, 12);

    // Flat black/dark-slate materials for 2D-looking limbs
    const limbMat = new THREE.MeshBasicMaterial({ color: '#1b222c' });
    const pawMat = new THREE.MeshBasicMaterial({ color: '#1b222c' });

    leftArmMesh = new THREE.Mesh(limbGeo, limbMat);
    rightArmMesh = new THREE.Mesh(limbGeo, limbMat);
    leftLegMesh = new THREE.Mesh(limbGeo, limbMat);
    rightLegMesh = new THREE.Mesh(limbGeo, limbMat);

    leftArmMesh.castShadow = true;
    rightArmMesh.castShadow = true;
    leftLegMesh.castShadow = true;
    rightLegMesh.castShadow = true;

    climberGroup.add(leftArmMesh);
    climberGroup.add(rightArmMesh);
    climberGroup.add(leftLegMesh);
    climberGroup.add(rightLegMesh);

    leftHandMesh = new THREE.Mesh(pawGeo, pawMat);
    rightHandMesh = new THREE.Mesh(pawGeo, pawMat);
    leftFootMesh = new THREE.Mesh(pawGeo, pawMat);
    rightFootMesh = new THREE.Mesh(pawGeo, pawMat);

    leftHandMesh.castShadow = true;
    rightHandMesh.castShadow = true;
    leftFootMesh.castShadow = true;
    rightFootMesh.castShadow = true;

    climberGroup.add(leftHandMesh);
    climberGroup.add(rightHandMesh);
    climberGroup.add(leftFootMesh);
    climberGroup.add(rightFootMesh);


  }
}

export function createClimber(scene) {
  climberGroup = new THREE.Group();
  climberGroup.position.set(0, 0, 0);
  scene.add(climberGroup);
  buildCharacter(scene);
  return climberGroup;
}

export function setClimberColor(hexColor) {
  if (!bodyMesh) return;
  bodyMesh.material.color.set(hexColor);
  
  // Generate a slightly darker shade for the limbs
  const limbColor = new THREE.Color(hexColor).multiplyScalar(0.85);
  if (leftArmMesh && leftArmMesh.material) {
    leftArmMesh.material.color.copy(limbColor);
  }
}

let parachuteMesh = null;
let isHoveringWithParachute = false;

function buildParachute() {
  const group = new THREE.Group();
  
  // 1. Canopy (hemisphere)
  const canopyGeo = new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const canopyMat = new THREE.MeshToonMaterial({
    color: '#f97316', // Sunset Orange
    side: THREE.DoubleSide,
    gradientMap: getToonGradientTexture()
  });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 0.9, 0); // Positioned above the climber
  group.add(canopy);
  
  // 2. White stripe/band on the canopy for detail
  const stripeGeo = new THREE.SphereGeometry(0.56, 16, 6, 0, Math.PI * 2, 0.3, 0.2);
  const stripeMat = new THREE.MeshToonMaterial({
    color: '#ffffff',
    side: THREE.DoubleSide,
    gradientMap: getToonGradientTexture()
  });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.set(0, 0.9, 0);
  group.add(stripe);

  // 3. Ropes
  const ropeMat = new THREE.LineBasicMaterial({ color: '#475569', linewidth: 2 });
  
  const rimPoints = [
    new THREE.Vector3(0.4, 0.9, 0),
    new THREE.Vector3(-0.4, 0.9, 0),
    new THREE.Vector3(0, 0.9, 0.4),
    new THREE.Vector3(0, 0.9, -0.4)
  ];
  
  const anchorPoint = new THREE.Vector3(0, 0.2, 0);
  
  rimPoints.forEach(pt => {
    const points = [pt, anchorPoint];
    const ropeGeo = new THREE.BufferGeometry().setFromPoints(points);
    const rope = new THREE.Line(ropeGeo, ropeMat);
    group.add(rope);
  });
  
  return group;
}

export function setClimberHovering(hovering) {
  isHoveringWithParachute = hovering;
  if (!climberGroup) return;
  
  if (hovering) {
    if (!parachuteMesh) {
      parachuteMesh = buildParachute();
    }
    if (parachuteMesh.parent !== climberGroup) {
      climberGroup.add(parachuteMesh);
    }
    // Make Sporky slightly bigger (1.35x)
    climberGroup.scale.set(1.35, 1.35, 1.35);
    climberGroup.position.z = 0.8;
  } else {
    if (parachuteMesh && parachuteMesh.parent === climberGroup) {
      climberGroup.remove(parachuteMesh);
    }
    climberGroup.scale.set(1.0, 1.0, 1.0);
    climberGroup.position.z = 0;
    
    // Reset body rotation that might be modified by the sway
    if (bodyMesh) {
      bodyMesh.rotation.set(0, 0, 0);
    }
  }
}

export function setClimberPosition(x, y) {
  const offset = getCoordinateOffset(x, y);
  position.set(x + offset.x, y + offset.y, isHoveringWithParachute ? 0.8 : 0);
  targetPosition.copy(position);
  climberGroup.position.copy(position);
  isAnimating = false;

  // Initialize hands and feet to default offsets relative to current climber position
  worldLeftHand.copy(position).add(baseLeftHand);
  worldRightHand.copy(position).add(baseRightHand);
  worldLeftFoot.copy(position).add(baseLeftFoot);
  worldRightFoot.copy(position).add(baseRightFoot);
}

// Trigger a bouncy squish effect (e.g. on drop or landing)
export function triggerSquish(intensity = 0.4) {
  springAmplitude = intensity;
  springTime = 0;
}

// Animate a hop from current position to a target hold
export function animateToPosition(x, y, duration = 0.45, onComplete = null) {
  startPosition.copy(climberGroup.position);
  const offset = getCoordinateOffset(x, y);
  targetPosition.set(x + offset.x, y + offset.y, 0);
  animationDuration = duration;
  animationTime = 0;
  isAnimating = true;
  onAnimComplete = onComplete;
}

// Set temporary stretch/squish manually during dragging
export function setDragStretch(dx, dy) {
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxStretch = 0.4;
  const stretchFactor = Math.min(dist * 0.12, maxStretch);
  
  if (dist > 0.01) {
    // Calculate angle of drag to rotate body mesh
    const angle = Math.atan2(dy, dx);
    
    if (selectedCharacter === 'slimey') {
      bodyMesh.rotation.z = angle - Math.PI / 2;
      bodyMesh.scale.set(
        1.05 - stretchFactor * 0.4,
        0.9 + stretchFactor * 1.0,
        0.85 - stretchFactor * 0.6
      );
    } else {
      // Kitten stays upright when dragged, only tilts slightly horizontally
      bodyMesh.rotation.z = Math.max(-0.25, Math.min(0.25, dx * 0.12));
      // Elongate body slightly vertically when dragging to simulate reach
      bodyMesh.scale.set(
        1.0 - stretchFactor * 0.2,
        1.0 + stretchFactor * 0.4,
        1.0
      );
    }
    
    // Make pupils look in the direction of the drag!
    const lookX = Math.cos(angle) * 0.04;
    const lookY = Math.sin(angle) * 0.04;
    if (selectedCharacter === 'slimey') {
      leftPupil.position.set(-0.14 + lookX, 0.12 + lookY, 0.35);
      rightPupil.position.set(0.14 + lookX, 0.12 + lookY, 0.35);
    } else {
      leftPupil.position.set(-0.09 + lookX, 0.28 + lookY, 0.23);
      rightPupil.position.set(0.09 + lookX, 0.28 + lookY, 0.23);
    }
  } else {
    resetClimberRotationAndScale();
  }
}

function resetClimberRotationAndScale() {
  bodyMesh.rotation.set(0, 0, 0);
  if (selectedCharacter === 'slimey') {
    bodyMesh.scale.set(1.05, 0.9, 0.85);
    leftPupil.position.set(-0.14, 0.12, 0.35);
    rightPupil.position.set(0.14, 0.12, 0.35);
  } else {
    bodyMesh.scale.set(1.0, 1.0, 1.0);
    leftPupil.position.set(-0.09, 0.28, 0.23);
    rightPupil.position.set(0.09, 0.28, 0.23);
  }
}

const getLimbCrawlPos = (startOffset, targetOffset, t, tStart, tEnd, startPos = startPosition, targetPos = targetPosition) => {
  const startPosWorld = startPos.clone().add(startOffset);
  const targetPosWorld = targetPos.clone().add(targetOffset);
  if (t < tStart) return startPosWorld;
  if (t > tEnd) return targetPosWorld;
  
  const localT = (t - tStart) / (tEnd - tStart);
  const easeT = Math.sin(localT * Math.PI / 2); // Eased step
  const pos = new THREE.Vector3().lerpVectors(startPosWorld, targetPosWorld, easeT);
  
  // Add lift arc in Z (out of the wall) and Y (upward step)
  const liftArc = Math.sin(localT * Math.PI);
  pos.z += liftArc * 0.25;
  pos.y += liftArc * 0.15;
  return pos;
};

export function updateClimber(deltaTime) {
  if (!climberGroup || !bodyMesh) return;

  totalElapsedTime += deltaTime;

  // Expression timer countdown
  if (expressionTimer > 0) {
    expressionTimer -= deltaTime;
    if (expressionTimer <= 0) {
      setClimberExpression('neutral');
    }
  }

  // 1. Hop / Slide Interpolation
  if (isAnimating) {
    animationTime += deltaTime;
    let t = Math.min(animationTime / animationDuration, 1.0);
    
    // Smooth step-in/out easing
    const easeT = t * t * (3 - 2 * t);
    
    // Calculate horizontal slide
    const currentPos = new THREE.Vector3().lerpVectors(startPosition, targetPosition, easeT);
    
    // Add cartoon arc hop height (parabolic arc)
    const arcHeight = 1.2;
    const hopY = Math.sin(t * Math.PI) * arcHeight;
    currentPos.y += hopY;
    
    climberGroup.position.copy(currentPos);
    
    // Dynamic rotation during hop
    const nextT = Math.min(t + 0.05, 1.0);
    const nextPos = new THREE.Vector3().lerpVectors(startPosition, targetPosition, nextT);
    nextPos.y += Math.sin(nextT * Math.PI) * arcHeight;
    const diff = nextPos.clone().sub(currentPos);
    
    if (diff.lengthSq() > 0.001) {
      if (selectedCharacter === 'slimey') {
        bodyMesh.rotation.z = Math.atan2(diff.y, diff.x) - Math.PI / 2;
      } else {
        // Kitten sequential climb tilt: tilt slightly in direction of horizontal motion
        const dx = targetPosition.x - startPosition.x;
        let tiltTarget = 0;
        if (dx > 0.1) tiltTarget = -0.25; // tilt right
        else if (dx < -0.1) tiltTarget = 0.25; // tilt left
        bodyMesh.rotation.z = Math.sin(t * Math.PI) * tiltTarget;
      }
    }
    
    // Stretch during peak of jump, squish during takeoff/landing
    const stretch = Math.sin(t * Math.PI) * 0.3;
    if (selectedCharacter === 'slimey') {
      bodyMesh.scale.set(
        1.05 - stretch * 0.4,
        0.9 + stretch * 0.8,
        0.85 - stretch * 0.4
      );
    } else {
      // Kitten stretch
      bodyMesh.scale.set(
        1.0 - stretch * 0.2,
        1.0 + stretch * 0.3,
        1.0
      );
    }

    // Procedural sequential crawling limb animation:
    worldLeftHand.copy(getLimbCrawlPos(baseLeftHand, baseLeftHand, t, 0.0, 0.35));
    worldRightHand.copy(getLimbCrawlPos(baseRightHand, baseRightHand, t, 0.20, 0.55));
    worldLeftFoot.copy(getLimbCrawlPos(baseLeftFoot, baseLeftFoot, t, 0.40, 0.75));
    worldRightFoot.copy(getLimbCrawlPos(baseRightFoot, baseRightFoot, t, 0.60, 0.95));

    if (t >= 1.0) {
      isAnimating = false;
      climberGroup.position.copy(targetPosition);
      resetClimberRotationAndScale();
      triggerSquish(0.45); // Juicy landing squash!
      if (onAnimComplete) {
        onAnimComplete();
      }
    }
  } else if (isDraggingClimber) {
    // 1b. Dragging crawl animation!
    const dir = new THREE.Vector3().subVectors(climberGroup.position, dragStartAnchor);
    const d = dir.length();
    
    if (d > 0.05) {
      const vDir = dir.clone().normalize();
      const stepIndex = Math.floor(d);
      const tCrawl = d - stepIndex;
      
      const stepStartPos = dragStartAnchor.clone().addScaledVector(vDir, stepIndex);
      const stepTargetPos = dragStartAnchor.clone().addScaledVector(vDir, stepIndex + 1);
      
      worldLeftHand.copy(getLimbCrawlPos(baseLeftHand, baseLeftHand, tCrawl, 0.0, 0.35, stepStartPos, stepTargetPos));
      worldRightHand.copy(getLimbCrawlPos(baseRightHand, baseRightHand, tCrawl, 0.20, 0.55, stepStartPos, stepTargetPos));
      worldLeftFoot.copy(getLimbCrawlPos(baseLeftFoot, baseLeftFoot, tCrawl, 0.40, 0.75, stepStartPos, stepTargetPos));
      worldRightFoot.copy(getLimbCrawlPos(baseRightFoot, baseRightFoot, tCrawl, 0.60, 0.95, stepStartPos, stepTargetPos));
    } else {
      worldLeftHand.copy(climberGroup.position).add(baseLeftHand);
      worldRightHand.copy(climberGroup.position).add(baseRightHand);
      worldLeftFoot.copy(climberGroup.position).add(baseLeftFoot);
      worldRightFoot.copy(climberGroup.position).add(baseRightFoot);
    }
  } else {
    // 2. Idle breathing bobbing animation
    const bob = Math.sin(totalElapsedTime * 3.5) * 0.012;
    const breatheScale = 1.0 + Math.sin(totalElapsedTime * 3.5) * 0.02;

    // Apply gentle idle squash and stretch to body if spring physics is not dominating
    if (springAmplitude <= 0.01) {
      if (selectedCharacter === 'slimey') {
        bodyMesh.scale.set(1.05 * (2.0 - breatheScale), 0.9 * breatheScale, 0.85);
      } else {
        bodyMesh.scale.set(1.0, 1.0 + bob * 0.5, 1.0);
      }
    }

    // Hands and feet follow body with a slight bobbing delay
    worldLeftHand.copy(climberGroup.position).add(baseLeftHand);
    worldLeftHand.y += bob;

    worldRightHand.copy(climberGroup.position).add(baseRightHand);
    worldRightHand.y += bob;

    worldLeftFoot.copy(climberGroup.position).add(baseLeftFoot);
    worldLeftFoot.y -= bob * 0.5;

    worldRightFoot.copy(climberGroup.position).add(baseRightFoot);
    worldRightFoot.y -= bob * 0.5;
  }

  // 3. Spring Physics update for landing squish
  if (springAmplitude > 0.01) {
    springTime += deltaTime;
    const springVal = springAmplitude * Math.cos(springFrequency * springTime) * Math.exp(-springDecay * springTime);
    
    if (selectedCharacter === 'slimey') {
      squishY = 0.9 - springVal;
      squishX = 1.05 + springVal * 0.6;
      bodyMesh.scale.set(squishX, squishY, 0.85 + springVal * 0.4);
    } else {
      bodyMesh.scale.set(1.0 + springVal * 0.3, 1.0 - springVal * 0.4, 1.0);
    }
    
    if (Math.abs(springVal) < 0.005) {
      springAmplitude = 0;
      resetClimberRotationAndScale();
    }
  }

  // Apply parachute sway and force Z position if hovering
  if (isHoveringWithParachute) {
    climberGroup.position.z = 0.8;
    const swayAngle = Math.sin(totalElapsedTime * 2.0) * 0.08;
    bodyMesh.rotation.z = swayAngle;
    if (parachuteMesh) {
      parachuteMesh.rotation.z = -swayAngle * 0.5;
      parachuteMesh.position.x = Math.sin(totalElapsedTime * 2.0) * 0.03;
    }
  }

  // 4. Update Limbs and Paw meshes positions & orientations
  // Calculate local coordinates of hands/feet relative to climberGroup
  const localLeftHand = worldLeftHand.clone().sub(climberGroup.position);
  const localRightHand = worldRightHand.clone().sub(climberGroup.position);
  const localLeftFoot = worldLeftFoot.clone().sub(climberGroup.position);
  const localRightFoot = worldRightFoot.clone().sub(climberGroup.position);

  // Update hand/foot meshes local positions
  leftHandMesh.position.copy(localLeftHand);
  rightHandMesh.position.copy(localRightHand);
  leftFootMesh.position.copy(localLeftFoot);
  rightFootMesh.position.copy(localRightFoot);

  // Compute scaled and rotated joint points
  const currentLeftShoulder = leftShoulder.clone().multiply(bodyMesh.scale).applyAxisAngle(new THREE.Vector3(0, 0, 1), bodyMesh.rotation.z);
  const currentRightShoulder = rightShoulder.clone().multiply(bodyMesh.scale).applyAxisAngle(new THREE.Vector3(0, 0, 1), bodyMesh.rotation.z);
  const currentLeftHip = leftHip.clone().multiply(bodyMesh.scale).applyAxisAngle(new THREE.Vector3(0, 0, 1), bodyMesh.rotation.z);
  const currentRightHip = rightHip.clone().multiply(bodyMesh.scale).applyAxisAngle(new THREE.Vector3(0, 0, 1), bodyMesh.rotation.z);

  // Update arm and leg cylinders
  updateLimb(leftArmMesh, currentLeftShoulder, localLeftHand);
  updateLimb(rightArmMesh, currentRightShoulder, localRightHand);
  updateLimb(leftLegMesh, currentLeftHip, localLeftFoot);
  updateLimb(rightLegMesh, currentRightHip, localRightFoot);

  // No tail sway needed for orangutan
}

export function getClimberGroup() { return climberGroup; }
export function getClimberPosition() { return climberGroup ? climberGroup.position : position; }

export function setClimberExpression(expression, duration = null) {
  if (!bodyMesh || !mouthMesh || !neutralMouthMesh || !leftEyebrow || !rightEyebrow || !leftEye || !rightEye || !leftPupil || !rightPupil) return;

  currentExpression = expression;
  if (duration !== null) {
    expressionTimer = duration;
  } else {
    expressionTimer = 0;
  }

  const scaleY = (expression === 'happy') ? 0.6 : ((expression === 'sad') ? 0.9 : 1.0);
  leftEye.scale.y = scaleY;
  rightEye.scale.y = scaleY;
  leftPupil.scale.y = scaleY;
  rightPupil.scale.y = scaleY;

  if (expression === 'happy') {
    mouthMesh.visible = true;
    neutralMouthMesh.visible = false;
    mouthMesh.rotation.z = Math.PI;
    mouthMesh.scale.set(1.4, 1.4, 1.0);
    
    leftEyebrow.rotation.z = 0.2;
    leftEyebrow.position.set(-0.14, 0.24, 0.38);
    
    rightEyebrow.rotation.z = -0.2;
    rightEyebrow.position.set(0.14, 0.24, 0.38);
  } else if (expression === 'sad') {
    mouthMesh.visible = true;
    neutralMouthMesh.visible = false;
    mouthMesh.rotation.z = 0;
    mouthMesh.scale.set(1.1, 1.1, 1.0);
    
    leftEyebrow.rotation.z = -0.25;
    leftEyebrow.position.set(-0.14, 0.19, 0.38);
    
    rightEyebrow.rotation.z = 0.25;
    rightEyebrow.position.set(0.14, 0.19, 0.38);
  } else {
    // neutral
    mouthMesh.visible = false;
    neutralMouthMesh.visible = true;
    mouthMesh.rotation.z = Math.PI;
    mouthMesh.scale.set(1.0, 1.0, 1.0);
    
    leftEyebrow.rotation.z = 0;
    leftEyebrow.position.set(-0.14, 0.22, 0.38);
    
    rightEyebrow.rotation.z = 0;
    rightEyebrow.position.set(0.14, 0.22, 0.38);
  }
}

export function updateClimberOutfit(outfitId) {
  // Outfits are sidebar-only, no-op here
}
