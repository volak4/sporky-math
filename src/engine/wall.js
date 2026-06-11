import * as THREE from 'three';

let wallGroup;
let gridLinesGroup;
let axesGroup;
let holdsArray = [];
let toonGradient;

// Generate a procedural 4-tone cell shading gradient texture
function getToonGradient() {
  if (toonGradient) return toonGradient;

  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  // 4 bands of light intensities for cell-shading
  ctx.fillStyle = '#555555'; ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = '#888888'; ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = '#cccccc'; ctx.fillRect(2, 0, 1, 1);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(3, 0, 1, 1);
  
  toonGradient = new THREE.CanvasTexture(canvas);
  toonGradient.minFilter = THREE.NearestFilter;
  toonGradient.magFilter = THREE.NearestFilter;
  return toonGradient;
}

// Pseudo-random coordinate offset helper (reverted to zero for perfect Cartesian symmetry)
export function getCoordinateOffset(x, y) {
  return { x: 0, y: 0 };
}

// Helper to create a cartoon billboard text sprite for coordinates
function createNumberSprite(numberText, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  // Custom cartoon font matching UI
  ctx.font = 'bold 38px Fredoka, sans-serif';
  ctx.fillStyle = colorHex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Thicker outline for cartoon contrast
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  ctx.strokeText(numberText, 32, 32);
  ctx.fillText(numberText, 32, 32);
  
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.38, 0.38, 1);
  return sprite;
}

// Piecewise function to determine if a coordinate lies inside the mountain silhouette
export function isInsideMountain(x, y) {
  if (x < -6.5 || x > 6.5) return false;
  if (y < -6.0) return false;

  // Mountain profile: (-6.5, 0.5), (-4, 3.2), (-2, 2.0), (0.8, 5.8), (2.8, 3.8), (4.8, 4.8), (6.5, 1.2)
  let yMax = 0;
  
  if (x < -4.0) {
    const t = (x - -6.5) / 2.5;
    yMax = 0.5 + t * 2.7;
  } else if (x < -2.0) {
    const t = (x - -4.0) / 2.0;
    yMax = 3.2 - t * 1.2;
  } else if (x < 0.8) {
    const t = (x - -2.0) / 2.8;
    yMax = 2.0 + t * 3.8;
  } else if (x < 2.8) {
    const t = (x - 0.8) / 2.0;
    yMax = 5.8 - t * 2.0;
  } else if (x < 4.8) {
    const t = (x - 2.8) / 2.0;
    yMax = 3.8 + t * 1.0;
  } else {
    const t = (x - 4.8) / 1.7;
    yMax = 4.8 - t * 3.6;
  }

  return y <= (yMax + 0.3);
}

export function createClimbingWall(scene) {
  wallGroup = new THREE.Group();
  gridLinesGroup = new THREE.Group();
  axesGroup = new THREE.Group();
  
  const gradient = getToonGradient();

  // 1. BACKGROUND MOUNTAIN RANGE (Cool slate rock)
  const bgShape = new THREE.Shape();
  bgShape.moveTo(-8.0, -6.5);
  bgShape.lineTo(-8.0, 3.0);
  bgShape.lineTo(-5.5, 5.2);
  bgShape.lineTo(-3.0, 4.0);
  bgShape.lineTo(-1.0, 5.0);
  bgShape.lineTo(2.0, 2.5);
  bgShape.lineTo(4.0, 4.5);
  bgShape.lineTo(8.0, 1.0);
  bgShape.lineTo(8.0, -6.5);
  bgShape.closePath();

  const bgExtrudeSettings = {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 3,
    steps: 1
  };

  const bgMat = new THREE.MeshToonMaterial({
    color: '#64748b',
    gradientMap: gradient
  });

  const bgMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(bgShape, bgExtrudeSettings), bgMat);
  bgMesh.position.set(0, 0, -1.8);
  bgMesh.receiveShadow = true;
  wallGroup.add(bgMesh);


  // 2. MAIN FRONT CLIMBING MOUNTAIN (Warm sandstone rock)
  const mountainShape = new THREE.Shape();
  mountainShape.moveTo(-6.5, -6.5);
  mountainShape.lineTo(-6.5, 0.5);
  mountainShape.lineTo(-4.0, 3.2);
  mountainShape.lineTo(-2.0, 2.0);
  mountainShape.lineTo(0.8, 5.8);
  mountainShape.lineTo(2.8, 3.8);
  mountainShape.lineTo(4.8, 4.8);
  mountainShape.lineTo(6.5, 1.2);
  mountainShape.lineTo(6.5, -6.5);
  mountainShape.closePath();

  const mainExtrudeSettings = {
    depth: 0.45,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 3,
    steps: 1
  };

  const mainMat = new THREE.MeshToonMaterial({
    color: '#bd8664',
    gradientMap: gradient
  });

  const mainMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(mountainShape, mainExtrudeSettings), mainMat);
  mainMesh.position.set(0, 0, -0.85);
  mainMesh.castShadow = true;
  mainMesh.receiveShadow = true;
  wallGroup.add(mainMesh);


  // 3. SNOWCAP ON THE HIGHEST PEAK (Crisp white snow overlay)
  const snowShape = new THREE.Shape();
  snowShape.moveTo(-1.2, 3.25);
  snowShape.lineTo(0.8, 5.85);
  snowShape.lineTo(2.4, 4.25);
  snowShape.lineTo(1.8, 3.85);
  snowShape.lineTo(1.2, 4.25);
  snowShape.lineTo(0.5, 3.65);
  snowShape.lineTo(-0.3, 4.05);
  snowShape.closePath();

  const snowExtrudeSettings = {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.04,
    bevelSegments: 3,
    steps: 1
  };

  const snowMat = new THREE.MeshToonMaterial({
    color: '#f8fafc',
    gradientMap: gradient
  });

  const snowMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(snowShape, snowExtrudeSettings), snowMat);
  snowMesh.position.set(0, 0, -0.38);
  snowMesh.castShadow = true;
  snowMesh.receiveShadow = true;
  wallGroup.add(snowMesh);


  // 4. BOLT HOLES (Rendered with coordinates offsets to fit holds)
  const holeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 8);
  holeGeo.rotateX(Math.PI / 2);
  const holeMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });

  for (let x = -5; x <= 5; x++) {
    for (let y = -5; y <= 5; y++) {
      if (isInsideMountain(x, y)) {
        const hole = new THREE.Mesh(holeGeo, holeMat);
        const offset = getCoordinateOffset(x, y);
        const isUnderSnow = (x >= -1.2 && x <= 2.4 && y >= 3.2);
        
        // Position hole at offset coordinate
        hole.position.set(x + offset.x, y + offset.y, isUnderSnow ? -0.18 : -0.28);
        wallGroup.add(hole);
      }
    }
  }

  // 5. GRID LINES (Aesthetic projection grid, kept straight for coordinate reference)
  const gridMat = new THREE.LineBasicMaterial({
    color: '#64748b',
    transparent: true,
    opacity: 0.35
  });

  const gridPoints = [];
  for (let i = -5; i <= 5; i++) {
    gridPoints.push(new THREE.Vector3(i, -5.5, -0.16));
    gridPoints.push(new THREE.Vector3(i, 5.5, -0.16));
    gridPoints.push(new THREE.Vector3(-5.5, i, -0.16));
    gridPoints.push(new THREE.Vector3(5.5, i, -0.16));
  }

  const gridGeo = new THREE.BufferGeometry().setFromPoints(gridPoints);
  const gridLines = new THREE.LineSegments(gridGeo, gridMat);
  gridLinesGroup.add(gridLines);

  // 6. X and Y AXES
  const xAxisGeo = new THREE.BoxGeometry(11.2, 0.08, 0.04);
  const xAxisMat = new THREE.MeshBasicMaterial({ color: '#22c55e', transparent: true, opacity: 0.85 }); // Green axis line
  const xAxis = new THREE.Mesh(xAxisGeo, xAxisMat);
  xAxis.position.set(0, 0, -0.15);
  axesGroup.add(xAxis);

  const yAxisGeo = new THREE.BoxGeometry(0.08, 11.2, 0.04);
  const yAxisMat = new THREE.MeshBasicMaterial({ color: '#eab308', transparent: true, opacity: 0.85 }); // Yellow axis line
  const yAxis = new THREE.Mesh(yAxisGeo, yAxisMat);
  yAxis.position.set(0, 0, -0.15);
  axesGroup.add(yAxis);

  // Axis Ends
  const labelGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const xLabelMat = new THREE.MeshBasicMaterial({ color: '#22c55e' });
  const yLabelMat = new THREE.MeshBasicMaterial({ color: '#eab308' });

  const xNodePlus = new THREE.Mesh(labelGeo, xLabelMat);
  xNodePlus.position.set(5.6, 0, -0.15);
  axesGroup.add(xNodePlus);

  const yNodePlus = new THREE.Mesh(labelGeo, yLabelMat);
  yNodePlus.position.set(0, 5.6, -0.15);
  axesGroup.add(yNodePlus);

  // 7. AXES PEGS LABELS (Numbers on the axes)
  // X-axis: numbers underneath in green
  for (let x = -5; x <= 5; x++) {
    const offset = getCoordinateOffset(x, 0);
    const label = createNumberSprite(x.toString(), '#22c55e'); // Vibrant green color
    label.position.set(x + offset.x, 0 - 0.38 + offset.y, -0.14);
    axesGroup.add(label);
  }

  // Y-axis: numbers to the left in yellow
  for (let y = -5; y <= 5; y++) {
    const offset = getCoordinateOffset(0, y);
    const label = createNumberSprite(y.toString(), '#eab308'); // Vibrant yellow color
    label.position.set(0 - 0.38 + offset.x, y + offset.y, -0.14);
    axesGroup.add(label);
  }

  scene.add(wallGroup);
  scene.add(gridLinesGroup);
  scene.add(axesGroup);
}

export function setGridVisibility(visible) {
  gridLinesGroup.visible = visible;
  axesGroup.visible = visible;
}

export function setMountainVisibility(visible) {
  wallGroup.visible = visible;
}

// Procedural climbing hold generator (with offsets applied)
export function createHold(scene, x, y, holdType = 'jug', colorHex = '#e11d48', isTarget = false) {
  const gradient = getToonGradient();
  const offset = getCoordinateOffset(x, y);

  // Custom Toon material for the hold
  const holdMat = new THREE.MeshToonMaterial({
    color: colorHex,
    gradientMap: gradient
  });

  // Base spacer
  const gasketGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 10);
  gasketGeo.rotateX(Math.PI / 2);
  const gasketMat = new THREE.MeshBasicMaterial({ color: '#0f172a' });
  const gasket = new THREE.Mesh(gasketGeo, gasketMat);
  gasket.position.set(x + offset.x, y + offset.y, -0.15);
  
  let holdGeo;
  let scale = [1, 1, 1];
  let rotation = [0, 0, 0];

  switch (holdType) {
    case 'jug':
      holdGeo = new THREE.TorusGeometry(0.16, 0.08, 8, 16);
      rotation = [Math.PI / 3, 0, Math.random() * Math.PI];
      break;
    case 'crimp':
      holdGeo = new THREE.BoxGeometry(0.35, 0.12, 0.14);
      rotation = [0, 0, (Math.random() * 0.2 - 0.1) * Math.PI];
      break;
    case 'pocket':
      holdGeo = new THREE.TorusGeometry(0.15, 0.06, 6, 12, Math.PI);
      rotation = [0, 0, 0];
      break;
    case 'star':
      holdGeo = new THREE.ConeGeometry(0.24, 0.28, 5);
      holdGeo.rotateX(Math.PI / 2);
      rotation = [0, 0, Math.PI / 2];
      break;
    case 'block':
    default:
      holdGeo = new THREE.BoxGeometry(0.26, 0.26, 0.2);
      rotation = [Math.random() * 0.1, Math.random() * 0.1, Math.random() * Math.PI];
      break;
  }

  const holdMesh = new THREE.Mesh(holdGeo, holdMat);
  holdMesh.position.set(x + offset.x, y + offset.y, -0.12);
  holdMesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  holdMesh.scale.set(scale[0], scale[1], scale[2]);
  
  // Add a silver bolt cap in the center
  const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 6);
  boltGeo.rotateX(Math.PI / 2);
  const boltMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.8, roughness: 0.2 });
  const bolt = new THREE.Mesh(boltGeo, boltMat);
  bolt.position.set(0, 0, holdType === 'crimp' ? 0.07 : 0.05);
  holdMesh.add(bolt);

  const holdGroup = new THREE.Group();
  holdGroup.add(gasket);
  holdGroup.add(holdMesh);
  
  holdMesh.castShadow = true;
  holdMesh.receiveShadow = true;
  
  holdGroup.userData = {
    x: x,
    y: y,
    isTarget: isTarget,
    type: holdType,
    color: colorHex,
    mesh: holdMesh
  };

  scene.add(holdGroup);
  holdsArray.push(holdGroup);
  return holdGroup;
}

let coordinateLabelSprite = null;
let destinationLabelSprite = null;
let slopeValueLabelSprite = null;
let signLabelsArray = [];

export function createSignLabel(scene, x, y, text, colorHex) {
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
  const sprite = new THREE.Sprite(material);

  const offset = getCoordinateOffset(x, y);
  sprite.position.set(x + offset.x, y + 0.45 + offset.y, -0.05);
  sprite.scale.set(1.4, 0.70, 1);

  scene.add(sprite);
  signLabelsArray.push(sprite);
  return sprite;
}

export function clearHolds(scene) {
  if (coordinateLabelSprite) {
    scene.remove(coordinateLabelSprite);
    if (coordinateLabelSprite.material.map) coordinateLabelSprite.material.map.dispose();
    coordinateLabelSprite.material.dispose();
    coordinateLabelSprite = null;
  }
  if (destinationLabelSprite) {
    scene.remove(destinationLabelSprite);
    if (destinationLabelSprite.material.map) destinationLabelSprite.material.map.dispose();
    destinationLabelSprite.material.dispose();
    destinationLabelSprite = null;
  }
  if (slopeValueLabelSprite) {
    scene.remove(slopeValueLabelSprite);
    if (slopeValueLabelSprite.material.map) slopeValueLabelSprite.material.map.dispose();
    slopeValueLabelSprite.material.dispose();
    slopeValueLabelSprite = null;
  }
  signLabelsArray.forEach(sprite => {
    scene.remove(sprite);
    if (sprite.material.map) sprite.material.map.dispose();
    sprite.material.dispose();
  });
  signLabelsArray = [];
  holdsArray.forEach(hold => {
    scene.remove(hold);
    hold.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  });
  holdsArray = [];
}

export function getHolds() {
  return holdsArray;
}
export function getToonGradientTexture() {
  return getToonGradient();
}

function createLabelSprite(x, y, colorX = '#22c55e', colorY = '#eab308') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.font = 'bold 44px Fredoka, sans-serif';
  ctx.textBaseline = 'middle';

  const xStr = x.toString();
  const yStr = y.toString();
  const openParen = '(';
  const comma = ', ';
  const closeParen = ')';

  const wOpen = ctx.measureText(openParen).width;
  const wX = ctx.measureText(xStr).width;
  const wComma = ctx.measureText(comma).width;
  const wY = ctx.measureText(yStr).width;
  const wClose = ctx.measureText(closeParen).width;

  const totalWidth = wOpen + wX + wComma + wY + wClose;
  let startX = (canvas.width - totalWidth) / 2;
  const centerY = canvas.height / 2;

  const drawSegment = (text, color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.strokeText(text, startX, centerY);
    ctx.fillText(text, startX, centerY);
    startX += ctx.measureText(text).width;
  };

  drawSegment(openParen, '#ffffff');
  drawSegment(xStr, colorX); // Green X
  drawSegment(comma, '#ffffff');
  drawSegment(yStr, colorY); // Yellow Y
  drawSegment(closeParen, '#ffffff');

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);

  const offset = getCoordinateOffset(x, y);
  sprite.position.set(x + offset.x, y - 0.55 + offset.y, -0.10);
  sprite.scale.set(1.1, 0.55, 1);

  return sprite;
}

export function updateCoordinateLabel(scene, x, y, visible) {
  if (coordinateLabelSprite) {
    scene.remove(coordinateLabelSprite);
    if (coordinateLabelSprite.material.map) coordinateLabelSprite.material.map.dispose();
    coordinateLabelSprite.material.dispose();
    coordinateLabelSprite = null;
  }

  if (!visible) return;

  coordinateLabelSprite = createLabelSprite(x, y);
  scene.add(coordinateLabelSprite);
}

export function setDestinationLabel(scene, x, y, visible) {
  if (destinationLabelSprite) {
    scene.remove(destinationLabelSprite);
    if (destinationLabelSprite.material.map) destinationLabelSprite.material.map.dispose();
    destinationLabelSprite.material.dispose();
    destinationLabelSprite = null;
  }

  if (!visible) return;

  destinationLabelSprite = createLabelSprite(x, y);
  scene.add(destinationLabelSprite);
}

export function createSlopeValueLabel(scene, x, y, rise, run, visible) {
  if (slopeValueLabelSprite) {
    scene.remove(slopeValueLabelSprite);
    if (slopeValueLabelSprite.material.map) slopeValueLabelSprite.material.map.dispose();
    slopeValueLabelSprite.material.dispose();
    slopeValueLabelSprite = null;
  }

  if (!visible) return;

  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.font = 'bold 36px Fredoka, sans-serif';
  ctx.textBaseline = 'middle';

  const text = `m = ${rise}/${run}`;

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
  slopeValueLabelSprite = new THREE.Sprite(material);

  const offset = getCoordinateOffset(x, y);
  // Position it slightly above the midpoint (e.g. y + 0.35) so it doesn't overlap the line
  slopeValueLabelSprite.position.set(x + offset.x, y + 0.35 + offset.y, -0.05);
  slopeValueLabelSprite.scale.set(1.4, 0.70, 1);

  scene.add(slopeValueLabelSprite);
}
