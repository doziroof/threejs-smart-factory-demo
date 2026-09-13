import * as THREE from "three";
import {
  createCamera,
  createControls,
  createGround,
  createLights,
  createRenderer,
  createScene,
} from "./scene.js";
import { createPulseRings, createStaticPlant, createTankField } from "./factory.js";
import { createParticleFlow, createStatusMarkers } from "./particles.js";

function showBootError(message) {
  const el = document.getElementById("boot-error");
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

const ui = {
  app: document.getElementById("app"),
  fps: document.getElementById("fps"),
  calls: document.getElementById("calls"),
  tris: document.getElementById("tris"),
  count: document.getElementById("count"),
  countLabel: document.getElementById("count-label"),
  speed: document.getElementById("speed"),
  btnInstanced: document.getElementById("btn-instanced"),
  btnMeshes: document.getElementById("btn-meshes"),
  btnParticles: document.getElementById("btn-particles"),
};

const state = {
  mode: "instanced",
  count: Number(ui.count.value),
  speed: Number(ui.speed.value) / 100,
  particlesOn: true,
};

let renderer;
try {
  renderer = createRenderer(ui.app);
} catch (err) {
  showBootError("WebGL 初始化失败：" + (err && err.message ? err.message : err));
  throw err;
}
const scene = createScene();
const camera = createCamera();
const controls = createControls(camera, renderer.domElement);

createLights(scene);
createGround(scene);
const { beacon, tip } = createStaticPlant(scene);
const rings = createPulseRings(scene);
const markers = createStatusMarkers(scene);
const flow = createParticleFlow(scene, 1000);

let field = createTankField(state.count, state.mode);
scene.add(field.group);

// FPS measurement
const clock = new THREE.Clock();
let frames = 0;
let fpsElapsed = 0;

function disposeField() {
  scene.remove(field.group);
  field.group.traverse((obj) => {
    if (obj.isMesh || obj.isInstancedMesh) {
      // shared geometries/materials are reused intentionally
    }
  });
  field = null;
}

function rebuildField() {
  disposeField();
  field = createTankField(state.count, state.mode);
  scene.add(field.group);
  syncModeButtons();
}

function syncModeButtons() {
  ui.btnInstanced.classList.toggle("active", state.mode === "instanced");
  ui.btnMeshes.classList.toggle("active", state.mode === "meshes");
}

function setMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  rebuildField();
}

ui.btnInstanced.addEventListener("click", () => setMode("instanced"));
ui.btnMeshes.addEventListener("click", () => setMode("meshes"));

ui.count.addEventListener("input", () => {
  state.count = Number(ui.count.value);
  ui.countLabel.textContent = String(state.count);
  rebuildField();
});

ui.speed.addEventListener("input", () => {
  state.speed = Number(ui.speed.value) / 100;
});

ui.btnParticles.addEventListener("click", () => {
  state.particlesOn = !state.particlesOn;
  flow.setEnabled(state.particlesOn);
  ui.btnParticles.classList.toggle("active", state.particlesOn);
  ui.btnParticles.textContent = state.particlesOn ? "开启" : "关闭";
});

function updateStats() {
  const info = renderer.info;
  ui.fps.textContent = String(Math.round(frames));
  ui.calls.textContent = String(info.render.calls);
  ui.tris.textContent = info.render.triangles.toLocaleString("zh-CN");
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  frames += 1;
  fpsElapsed += delta;
  if (fpsElapsed >= 0.5) {
    updateStats();
    frames = 0;
    fpsElapsed = 0;
  }

  controls.update();

  // pulse rings
  rings.forEach((ring) => {
    const p = (elapsed * 0.35 + ring.userData.offset) % 1;
    const s = 8 + p * 14;
    ring.scale.set(s, s, 1);
    ring.material.opacity = 0.4 * (1 - p);
  });

  // beacon blink
  const pulse = 0.65 + Math.sin(elapsed * 3.2) * 0.35;
  beacon.material.emissiveIntensity = 0.8 + pulse;
  tip.material.emissiveIntensity = 0.7 + pulse * 0.8;

  if (state.particlesOn) {
    flow.update(elapsed, 0.4 + state.speed * 1.6);
  }
  markers.update(elapsed);

  // subtle tower glow breathing via fill light
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

syncModeButtons();
animate();
