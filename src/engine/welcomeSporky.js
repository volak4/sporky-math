import * as THREE from 'three';


let scene, camera, renderer;
let bodyMesh, sporkyGroup;
let leftPupil, rightPupil;
let leftEyebrow, rightEyebrow;
let leftArmGroup, rightArmGroup;
let leftLegPaw, rightLegPaw;
let leftLegCylinder, rightLegCylinder;
const leftLegJointLocal = new THREE.Vector3(-0.20, -0.20, 0.20);
const rightLegJointLocal = new THREE.Vector3(0.20, -0.20, 0.20);
let animationFrameId;
let containerElement;

// Mouse coordinates in normalized device space (-1 to 1)
let mouseX = 0;
let mouseY = 0;

export function initWelcomeSporky(container) {
  if (!container) return;
  containerElement = container;

  // 1. Create Scene
  scene = new THREE.Scene();

  // 2. Setup Camera (Perspective for dramatic foreground effect)
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 100);
  camera.position.set(0, 0, 5.0); // Centered camera positioned slightly further back to avoid clipping

  // 3. Setup WebGL Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Transparent background
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(5, 8, 8);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.45);
  fillLight.position.set(-5, -3, 3);
  scene.add(fillLight);

  // 5. Build Foreground Sporky Group
  sporkyGroup = new THREE.Group();
  sporkyGroup.position.set(0, -0.35, 2.0); // Shifted higher to keep him clear of the inline color selector
  sporkyGroup.scale.set(0.525, 0.525, 0.525); // Half size of 1.05
  scene.add(sporkyGroup);

  // Body (slightly squished sphere)
  const bodyGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const bodyMat = new THREE.MeshToonMaterial({
    color: localStorage.getItem('sporky_color') || '#06b6d4', // Load initial color
  });
  bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.scale.set(1.08, 0.92, 0.88);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  sporkyGroup.add(bodyMesh);

  // Eyes (white backing spheres)
  const eyeWhiteGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });

  const leftEye = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  leftEye.position.set(-0.18, 0.16, 0.38);
  bodyMesh.add(leftEye);

  const rightEye = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  rightEye.position.set(0.18, 0.16, 0.38);
  bodyMesh.add(rightEye);

  // Pupils (black spheres)
  const pupilGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const pupilMat = new THREE.MeshBasicMaterial({ color: '#0f172a' });

  leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
  leftPupil.position.set(-0.18, 0.16, 0.48);
  bodyMesh.add(leftPupil);

  rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
  rightPupil.position.set(0.18, 0.16, 0.48);
  bodyMesh.add(rightPupil);

  // Happy Torus Mouth (matching game version, no teeth, just a black smiling line)
  const mouthGeo = new THREE.TorusGeometry(0.08, 0.016, 8, 16, Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
  const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
  mouthMesh.position.set(0, -0.06, 0.48);
  mouthMesh.rotation.set(0, 0, Math.PI); // Rotate to curve upwards as a smile
  bodyMesh.add(mouthMesh);

  // Eyebrows
  const eyebrowGeo = new THREE.BoxGeometry(0.10, 0.025, 0.02);
  const eyebrowMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });

  leftEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMat);
  leftEyebrow.position.set(-0.18, 0.30, 0.48);
  leftEyebrow.rotation.z = 0.1;
  bodyMesh.add(leftEyebrow);

  rightEyebrow = new THREE.Mesh(eyebrowGeo, eyebrowMat);
  rightEyebrow.position.set(0.18, 0.30, 0.48);
  rightEyebrow.rotation.z = -0.1;
  bodyMesh.add(rightEyebrow);

  // Helper to add arms relative to their joint pivots so we can rotate/wave them easily
  function addLimb(parent, joint, target, limbMat, pawMat) {
    const limbGroup = new THREE.Group();
    limbGroup.position.copy(joint); // Pivot group at the joint
    parent.add(limbGroup);

    // Target position relative to the joint
    const localTarget = new THREE.Vector3().subVectors(target, joint);

    // Paw (hand)
    const pawGeo = new THREE.SphereGeometry(0.10, 16, 16);
    const paw = new THREE.Mesh(pawGeo, pawMat);
    paw.position.copy(localTarget);
    paw.castShadow = true;
    limbGroup.add(paw);

    // Cylinder stick arm
    const len = localTarget.length();
    const cylinderGeo = new THREE.CylinderGeometry(0.022, 0.022, len, 8);
    // Offset cylinder geometry so its pivot is at 0, 0, 0 (joint)
    cylinderGeo.translate(0, len / 2, 0);
    cylinderGeo.rotateX(Math.PI / 2);

    const cylinder = new THREE.Mesh(cylinderGeo, limbMat);
    cylinder.position.set(0, 0, 0);
    cylinder.lookAt(localTarget);
    cylinder.castShadow = true;
    limbGroup.add(cylinder);

    return limbGroup;
  }

  const limbMat = new THREE.MeshBasicMaterial({ color: '#1b222c' }); // black stick limbs
  const pawMat = new THREE.MeshBasicMaterial({ color: '#1b222c' }); // dark paws/feet

  // 1. Build Arms (Children of bodyMesh, swaying/waving relative to body)
  leftArmGroup = addLimb(bodyMesh, new THREE.Vector3(-0.23, 0.10, 0.20), new THREE.Vector3(-0.72, -0.05, 0.25), limbMat, pawMat);
  rightArmGroup = addLimb(bodyMesh, new THREE.Vector3(0.23, 0.10, 0.20), new THREE.Vector3(0.72, -0.05, 0.25), limbMat, pawMat);

  // 2. Build Legs (Paws are stationary on the enter button, stick meshes connect to moving body joints)
  const legCylinderGeo = new THREE.CylinderGeometry(0.022, 0.022, 1, 8);
  legCylinderGeo.rotateX(Math.PI / 2);
  legCylinderGeo.translate(0, 0, 0.5); // Start at z=0 and extend to z=1

  // Left leg paw (stationary, added to sporkyGroup)
  leftLegPaw = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 16), pawMat);
  leftLegPaw.position.set(-0.35, -0.55, 0.28);
  leftLegPaw.castShadow = true;
  sporkyGroup.add(leftLegPaw);

  // Right leg paw (stationary, added to sporkyGroup)
  rightLegPaw = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 16), pawMat);
  rightLegPaw.position.set(0.35, -0.55, 0.28);
  rightLegPaw.castShadow = true;
  sporkyGroup.add(rightLegPaw);

  // Leg stick cylinders (added to sporkyGroup, will be updated procedurally)
  leftLegCylinder = new THREE.Mesh(legCylinderGeo, limbMat);
  leftLegCylinder.castShadow = true;
  sporkyGroup.add(leftLegCylinder);

  rightLegCylinder = new THREE.Mesh(legCylinderGeo, limbMat);
  rightLegCylinder.castShadow = true;
  sporkyGroup.add(rightLegCylinder);



  // 6. Listen to Mouse Move for Eye Tracking
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);

  // 7. Start Animation Loop
  animate();
}

function handleMouseMove(e) {
  // Normalize cursor coords to range [-1, 1]
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}

function handleResize() {
  if (!renderer || !camera || !containerElement) return;
  const width = containerElement.clientWidth;
  const height = containerElement.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function updateLeg(cylinder, jointLocal, pawMesh) {
  if (!bodyMesh || !sporkyGroup) return;
  // Get joint position in sporkyGroup space
  const jointPos = jointLocal.clone().applyMatrix4(bodyMesh.matrix);
  
  // Position the cylinder at the joint
  cylinder.position.copy(jointPos);
  
  // Compute vector from joint to paw in local space
  const pawPos = pawMesh.position;
  const dir = new THREE.Vector3().subVectors(pawPos, jointPos);
  const dist = dir.length();
  
  // Get paw world position for lookAt
  const pawWorld = new THREE.Vector3();
  pawMesh.getWorldPosition(pawWorld);
  
  // Orient towards paw (lookAt expects world coordinates)
  cylinder.lookAt(pawWorld);
  
  // Scale cylinder length (Z scale)
  cylinder.scale.set(1, 1, dist);
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);

  const time = performance.now() * 0.0015;

  // 1. Rhythmic Dancing (Stationary relative to anchor)
  const swayZ = Math.sin(time * 5.0) * 0.12;  // Side-to-side rocking
  const twistY = Math.cos(time * 2.5) * 0.18; // Twisting rotation
  const danceScaleY = 0.92 + Math.abs(Math.sin(time * 5.0)) * 0.06; // Bouncy squish
  const danceScaleX = 1.08 - Math.abs(Math.sin(time * 5.0)) * 0.03;

  if (bodyMesh) {
    bodyMesh.position.y = 0; // Body center stationary, squishes/rotates
    bodyMesh.scale.set(danceScaleX, danceScaleY, 0.88);
    bodyMesh.rotation.y = twistY;
    bodyMesh.rotation.z = swayZ;
    bodyMesh.updateMatrix(); // Update matrix for localToWorld applyMatrix4
  }

  // Update procedural legs (connecting body to stationary feet)
  if (leftLegCylinder && leftLegPaw) {
    updateLeg(leftLegCylinder, leftLegJointLocal, leftLegPaw);
  }
  if (rightLegCylinder && rightLegPaw) {
    updateLeg(rightLegCylinder, rightLegJointLocal, rightLegPaw);
  }

  // Animate arm waving/wiggling
  if (leftArmGroup) {
    leftArmGroup.rotation.z = Math.sin(time * 5.0) * 0.22;
    leftArmGroup.rotation.x = Math.cos(time * 2.5) * 0.15;
  }
  if (rightArmGroup) {
    rightArmGroup.rotation.z = -Math.sin(time * 5.0) * 0.22;
    rightArmGroup.rotation.x = Math.cos(time * 2.5) * 0.15;
  }

  // 2. Pupil Mouse Tracking
  if (leftPupil && rightPupil) {
    const maxOffset = 0.045;
    const pupilX = mouseX * maxOffset;
    const pupilY = (mouseY + 0.1) * maxOffset;

    leftPupil.position.set(-0.18 + pupilX, 0.16 + pupilY, 0.48);
    rightPupil.position.set(0.18 + pupilX, 0.16 + pupilY, 0.48);
  }

  // 3. Eyebrow expression animations wiggling to the dance beat
  if (leftEyebrow && rightEyebrow) {
    leftEyebrow.position.y = 0.30 + Math.sin(time * 5.0) * 0.015;
    rightEyebrow.position.y = 0.30 + Math.cos(time * 5.0) * 0.015;
  }

  renderer.render(scene, camera);
}

export function stopWelcomeSporky() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
  
  if (renderer && renderer.domElement && renderer.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
}

export function setWelcomeSporkyColor(hexColor) {
  if (bodyMesh && bodyMesh.material) {
    bodyMesh.material.color.set(hexColor);
  }
}

// Called when the welcome screen becomes visible again (e.g. navigating back from map/game).
// Forces the WebGL renderer to recalculate its dimensions since the container may have had
// zero size while it was hidden.
export function resumeWelcomeSporky() {
  // Small delay to let the DOM layout recalculate after removing the 'hidden' class
  setTimeout(() => {
    handleResize();
    // Restart animation loop if it was stopped
    if (!animationFrameId) {
      animate();
    }
  }, 50);
}

export function updateWelcomeSporkyOutfit(outfitId) {
  // Outfits are sidebar-only, no-op here
}
