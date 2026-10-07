/**
 * Three.js Interactive Mechanical Gear & Kinematic Gimbal System
 * High-performance 3D visualization for Shravan Kumar's Engineering Portfolio
 */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth || 450;
  const height = container.clientHeight || 450;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Group for the entire mechanical mechanism
  const mechanismGroup = new THREE.Group();
  scene.add(mechanismGroup);

  // Theme-aware color management
  function getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      primary: isLight ? 0x0284c7 : 0x38bdf8,
      secondary: isLight ? 0x2563eb : 0x818cf8,
      accent: isLight ? 0xd97706 : 0xfbbf24,
      wireframe: isLight ? 0x94a3b8 : 0x475569,
      core: isLight ? 0x0f172a : 0x1e293b,
      metal: isLight ? 0x64748b : 0x334155,
      particles: isLight ? 0x0284c7 : 0x38bdf8
    };
  }

  let colors = getThemeColors();

  // Create Gear Geometry Helper
  function createGearMesh(radius, teethCount, toothDepth, thickness, innerRadius, colorHex) {
    const shape = new THREE.Shape();
    const totalPoints = teethCount * 2;
    const step = (Math.PI * 2) / totalPoints;

    for (let i = 0; i < totalPoints; i++) {
      const angle = i * step;
      const isToothTip = i % 2 === 0;
      const r = isToothTip ? radius + toothDepth : radius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();

    // Center hole for shaft
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    // Minor weight-reducing spoke holes
    const spokeHoles = 4;
    const spokeRadius = (innerRadius + radius) * 0.48;
    const spokeHoleSize = (radius - innerRadius) * 0.18;
    for (let j = 0; j < spokeHoles; j++) {
      const spAngle = (j * (Math.PI * 2)) / spokeHoles + Math.PI / 4;
      const sx = Math.cos(spAngle) * spokeRadius;
      const sy = Math.sin(spAngle) * spokeRadius;
      const spPath = new THREE.Path();
      spPath.absarc(sx, sy, spokeHoleSize, 0, Math.PI * 2, true);
      shape.holes.push(spPath);
    }

    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  // 1. Central Sun Gear
  const sunGear = createGearMesh(1.2, 16, 0.22, 0.35, 0.4, colors.primary);
  mechanismGroup.add(sunGear);

  // Central Hub / Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.6, 32);
  const shaftMat = new THREE.MeshStandardMaterial({
    color: colors.accent,
    metalness: 0.9,
    roughness: 0.2
  });
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.rotation.x = Math.PI / 2;
  mechanismGroup.add(shaft);

  // 2. Outer Ring Gear (Internal teeth visual wireframe)
  const ringGeo = new THREE.TorusGeometry(3.0, 0.12, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: colors.secondary,
    metalness: 0.8,
    roughness: 0.3
  });
  const outerRing = new THREE.Mesh(ringGeo, ringMat);
  mechanismGroup.add(outerRing);

  // Calibration Tick Marks Ring
  const tickRingGeo = new THREE.RingGeometry(2.6, 2.7, 48);
  const tickRingMat = new THREE.MeshBasicMaterial({
    color: colors.primary,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });
  const tickRing = new THREE.Mesh(tickRingGeo, tickRingMat);
  mechanismGroup.add(tickRing);

  // 3. Planetary Satellite Gears (3 orbiting gears)
  const planetGears = [];
  const planetCount = 3;
  const orbitDistance = 2.1;

  for (let i = 0; i < planetCount; i++) {
    const angle = (i * Math.PI * 2) / planetCount;
    const pGear = createGearMesh(0.65, 10, 0.15, 0.25, 0.2, colors.secondary);
    pGear.position.x = Math.cos(angle) * orbitDistance;
    pGear.position.y = Math.sin(angle) * orbitDistance;
    mechanismGroup.add(pGear);
    planetGears.push({ mesh: pGear, baseAngle: angle, speed: 1.2 });
  }

  // 4. Outer Gimbal Coordinate Rings (Kinematic Gyroscope)
  const gimbal1Geo = new THREE.TorusGeometry(3.5, 0.05, 12, 72);
  const gimbal1Mat = new THREE.MeshStandardMaterial({
    color: colors.wireframe,
    metalness: 0.9,
    roughness: 0.4
  });
  const gimbal1 = new THREE.Mesh(gimbal1Geo, gimbal1Mat);
  gimbal1.rotation.y = Math.PI / 5;
  mechanismGroup.add(gimbal1);

  const gimbal2Geo = new THREE.TorusGeometry(3.8, 0.04, 12, 72);
  const gimbal2Mat = new THREE.MeshBasicMaterial({
    color: colors.primary,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const gimbal2 = new THREE.Mesh(gimbal2Geo, gimbal2Mat);
  gimbal2.rotation.x = Math.PI / 4;
  mechanismGroup.add(gimbal2);

  // 5. Engineering Blueprint Particles (Floating kinematic points)
  const particleCount = 65;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 10;
    particlePositions[i + 1] = (Math.random() - 0.5) * 10;
    particlePositions[i + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: colors.primary,
    size: 0.065,
    transparent: true,
    opacity: 0.6
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
  keyLight.position.set(5, 6, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
  rimLight.position.set(-6, -4, -4);
  scene.add(rimLight);

  // Mouse Interactivity with Smooth Damping
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0.35;
  let targetRotationY = -0.4;
  let isHovered = false;

  const parentCard = container.closest('.hero-visual-card') || container;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (
      e.clientX >= rect.left - 150 &&
      e.clientX <= rect.right + 150 &&
      e.clientY >= rect.top - 150 &&
      e.clientY <= rect.bottom + 150
    ) {
      mouseX = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 1.5;
      mouseY = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 1.5;
      isHovered = true;
    } else {
      isHovered = false;
    }
  });

  // Touch support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        mouseX = ((touch.clientX - (rect.left + rect.width / 2)) / rect.width) * 1.5;
        mouseY = ((touch.clientY - (rect.top + rect.height / 2)) / rect.height) * 1.5;
        isHovered = true;
      }
    }
  }, { passive: true });

  // Update theme colors on switch
  window.update3DTheme = function () {
    colors = getThemeColors();
    sunGear.material.color.setHex(colors.primary);
    shaft.material.color.setHex(colors.accent);
    outerRing.material.color.setHex(colors.secondary);
    tickRing.material.color.setHex(colors.primary);
    gimbal1.material.color.setHex(colors.wireframe);
    gimbal2.material.color.setHex(colors.primary);
    particleMat.color.setHex(colors.primary);
    planetGears.forEach((p) => p.mesh.material.color.setHex(colors.secondary));
  };

  // IntersectionObserver to pause rendering when out of viewport
  let isVisible = true;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(container);

  // Resize handler
  function onResize() {
    if (!container) return;
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return; // Save resources

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Rotate Sun Gear
    sunGear.rotation.z += delta * 0.9;

    // Rotate Planetary Gears around center & on own axes
    planetGears.forEach((p, index) => {
      const currentOrbitAngle = p.baseAngle + elapsedTime * 0.35;
      p.mesh.position.x = Math.cos(currentOrbitAngle) * orbitDistance;
      p.mesh.position.y = Math.sin(currentOrbitAngle) * orbitDistance;
      p.mesh.rotation.z -= delta * 1.5; // Counter-rotation
    });

    // Outer rings subtle counter-rotations
    outerRing.rotation.z -= delta * 0.2;
    tickRing.rotation.z += delta * 0.15;
    gimbal1.rotation.y += delta * 0.4;
    gimbal1.rotation.x += delta * 0.2;
    gimbal2.rotation.x -= delta * 0.3;
    gimbal2.rotation.z += delta * 0.25;

    // Gentle particle drift
    particles.rotation.y = elapsedTime * 0.05;
    particles.rotation.x = elapsedTime * 0.03;

    // Interactive tilting with easing
    if (isHovered) {
      targetRotationY = mouseX * 0.8;
      targetRotationX = -mouseY * 0.8 + 0.3;
    } else {
      targetRotationY = Math.sin(elapsedTime * 0.6) * 0.2;
      targetRotationX = Math.cos(elapsedTime * 0.5) * 0.15 + 0.35;
    }

    mechanismGroup.rotation.y += (targetRotationY - mechanismGroup.rotation.y) * 0.05;
    mechanismGroup.rotation.x += (targetRotationX - mechanismGroup.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
})();
