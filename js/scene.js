import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  return renderer;
}

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b12);
  scene.fog = new THREE.FogExp2(0x070b12, 0.012);
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    400,
  );
  camera.position.set(28, 22, 34);
  return camera;
}

export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 8;
  controls.maxDistance = 90;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.target.set(0, 2.5, 0);
  return controls;
}

export function createLights(scene) {
  const hemi = new THREE.HemisphereLight(0xb1d4ff, 0x1a2030, 0.75);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(24, 36, 18);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 120;
  key.shadow.camera.left = -50;
  key.shadow.camera.right = 50;
  key.shadow.camera.top = 50;
  key.shadow.camera.bottom = -50;
  key.shadow.bias = -0.0002;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x7dd3fc, 0.55);
  rim.position.set(-20, 12, -18);
  scene.add(rim);

  const fill = new THREE.PointLight(0xa78bfa, 0.55, 80, 2);
  fill.position.set(0, 10, 0);
  scene.add(fill);

  return { hemi, key, rim, fill };
}

export function createGround(scene) {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(70, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0d1524,
      metalness: 0.2,
      roughness: 0.92,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(80, 40, 0x1e3a5f, 0x132033);
  grid.position.y = 0.02;
  scene.add(grid);

  const pad = new THREE.Mesh(
    new THREE.CircleGeometry(28, 64),
    new THREE.MeshStandardMaterial({
      color: 0x102033,
      metalness: 0.35,
      roughness: 0.75,
    }),
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = 0.04;
  pad.receiveShadow = true;
  scene.add(pad);

  return { ground, grid, pad };
}
