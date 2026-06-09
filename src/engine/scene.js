import * as THREE from 'three';

let scene, camera, renderer;
const VIEW_SIZE = 5.5; // units visible vertically from center to top (smaller = more zoomed in)

export function initScene(container) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#cbd5e1'); // Neutral grey-blue slate background

  // Camera setup - Orthographic removes perspective distortion
  const w = container.clientWidth || 1;
  const h = container.clientHeight || 1;
  const aspect = w / h;
  camera = new THREE.OrthographicCamera(
    -aspect * VIEW_SIZE,
    aspect * VIEW_SIZE,
    VIEW_SIZE,
    -VIEW_SIZE,
    0.1,
    100
  );
  // Position camera directly in front, looking down the Z axis
  camera.position.set(0, 0, 15);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting - cartoonish but rich, casting clear shadows
  // Ambient fill to avoid dark unreadable areas
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // Main directional light for clean shadows
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(4, 6, 12);
  dirLight.castShadow = true;
  
  // Shadow quality config
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  
  const d = 8;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0005;
  
  scene.add(dirLight);

  // Stylized cyan rim light from bottom left to fill shadow contrast
  const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.35);
  fillLight.position.set(-6, -4, 4);
  scene.add(fillLight);

  // Event listener for scaling
  window.addEventListener('resize', handleResize);
  
  return { scene, camera, renderer };
}

function handleResize() {
  if (!renderer || !camera) return;
  const container = renderer.domElement.parentElement;
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Guard against zero dimensions (container hidden or not yet laid out)
  if (width === 0 || height === 0) return;

  const aspect = width / height;

  camera.left = -aspect * VIEW_SIZE;
  camera.right = aspect * VIEW_SIZE;
  camera.top = VIEW_SIZE;
  camera.bottom = -VIEW_SIZE;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

export function getScene() { return scene; }
export function getCamera() { return camera; }
export function getRenderer() { return renderer; }
export function getViewSize() { return VIEW_SIZE; }
