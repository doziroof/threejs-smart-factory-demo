import * as THREE from "three";

const tankGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.8, 16, 1, false);
const tankTopGeo = new THREE.SphereGeometry(0.45, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
const pipeGeo = new THREE.BoxGeometry(0.18, 0.18, 1);
const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
const antennaGeo = new THREE.CylinderGeometry(0.04, 0.06, 1, 8);

const tankMat = new THREE.MeshStandardMaterial({
  color: 0x8fb8d8,
  metalness: 0.55,
  roughness: 0.35,
});
const tankTopMat = new THREE.MeshStandardMaterial({
  color: 0xb7d7f0,
  metalness: 0.4,
  roughness: 0.4,
});
const pipeMat = new THREE.MeshStandardMaterial({
  color: 0x5d7a99,
  metalness: 0.65,
  roughness: 0.4,
});
const buildingMat = new THREE.MeshStandardMaterial({
  color: 0x3d4f6a,
  metalness: 0.35,
  roughness: 0.7,
});
const accentMat = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,
  metalness: 0.5,
  roughness: 0.3,
  emissive: 0x0ea5e9,
  emissiveIntensity: 0.35,
});
const glowMat = new THREE.MeshStandardMaterial({
  color: 0x22d3ee,
  emissive: 0x06b6d4,
  emissiveIntensity: 1.2,
  metalness: 0.2,
  roughness: 0.25,
});

export function createStaticPlant(scene) {
  const plant = new THREE.Group();
  scene.add(plant);

  // Central tower
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 8, 24), buildingMat);
  tower.position.set(0, 4, 0);
  tower.castShadow = true;
  tower.receiveShadow = true;
  plant.add(tower);

  const towerCap = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.35, 24), accentMat);
  towerCap.position.set(0, 8.15, 0);
  plant.add(towerCap);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), glowMat);
  beacon.position.set(0, 8.7, 0);
  plant.add(beacon);

  // Main tanks ring
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.scale.set(1.4, 2.4, 1.4);
    tank.position.set(Math.cos(a) * 9, 2.15, Math.sin(a) * 9);
    tank.castShadow = true;
    tank.receiveShadow = true;
    plant.add(tank);

    const top = new THREE.Mesh(tankTopGeo, tankTopMat);
    top.scale.set(1.4, 1.1, 1.4);
    top.position.copy(tank.position);
    top.position.y = 2.15 + 2.15;
    plant.add(top);
  }

  // Pipe ring
  const pipeRing = new THREE.Mesh(
    new THREE.TorusGeometry(9, 0.12, 10, 80),
    pipeMat,
  );
  pipeRing.rotation.x = Math.PI / 2;
  pipeRing.position.y = 1.4;
  pipeRing.castShadow = true;
  plant.add(pipeRing);

  // Control building
  const office = new THREE.Mesh(new THREE.BoxGeometry(7, 2.4, 4.5), buildingMat);
  office.position.set(-14, 1.2, 8);
  office.castShadow = true;
  office.receiveShadow = true;
  plant.add(office);

  const officeGlass = new THREE.Mesh(
    new THREE.BoxGeometry(6.4, 1.1, 0.12),
    new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      metalness: 0.85,
      roughness: 0.15,
      transparent: true,
      opacity: 0.75,
    }),
  );
  officeGlass.position.set(-14, 1.5, 8 + 2.28);
  plant.add(officeGlass);

  // Antenna
  const antenna = new THREE.Mesh(antennaGeo, accentMat);
  antenna.scale.set(1, 6, 1);
  antenna.position.set(-14, 5.5, 8);
  antenna.castShadow = true;
  plant.add(antenna);

  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), glowMat);
  tip.position.set(-14, 8.6, 8);
  plant.add(tip);

  // Conveyor / platform blocks
  for (let i = 0; i < 5; i += 1) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 1.4), pipeMat);
    block.position.set(12, 0.55, -8 + i * 3.2);
    block.castShadow = true;
    block.receiveShadow = true;
    plant.add(block);
  }

  return { plant, beacon, tip };
}

/**
 * Build either InstancedMesh field or individual meshes for performance comparison.
 */
export function createTankField(count, mode = "instanced") {
  const group = new THREE.Group();
  group.name = mode === "instanced" ? "tank-field-instanced" : "tank-field-meshes";

  const positions = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const r = 13 + radiusAtY * 12 + (i % 5) * 0.35;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const s = 0.55 + ((i * 37) % 100) / 220;
    positions.push({ x, y: s * 0.9, z, s, phase: i * 0.17 });
  }

  if (mode === "instanced") {
    const body = new THREE.InstancedMesh(tankGeo, tankMat, count);
    const tops = new THREE.InstancedMesh(tankTopGeo, tankTopMat, count);
    body.castShadow = true;
    body.receiveShadow = true;
    tops.castShadow = true;

    const dummy = new THREE.Object3D();
    positions.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.s, p.s * 1.35, p.s);
      dummy.rotation.y = p.phase;
      dummy.updateMatrix();
      body.setMatrixAt(i, dummy.matrix);

      dummy.position.set(p.x, p.y + p.s * 1.2, p.z);
      dummy.scale.set(p.s, p.s * 0.85, p.s);
      dummy.updateMatrix();
      tops.setMatrixAt(i, dummy.matrix);
    });
    body.instanceMatrix.needsUpdate = true;
    tops.instanceMatrix.needsUpdate = true;
    group.add(body, tops);
    return { group, instanced: [body, tops], positions };
  }

  positions.forEach((p) => {
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.scale.set(p.s, p.s * 1.35, p.s);
    tank.position.set(p.x, p.y, p.z);
    tank.rotation.y = p.phase;
    tank.castShadow = true;
    tank.receiveShadow = true;

    const top = new THREE.Mesh(tankTopGeo, tankTopMat);
    top.scale.set(p.s, p.s * 0.85, p.s);
    top.position.set(p.x, p.y + p.s * 1.2, p.z);

    group.add(tank, top);
  });

  return { group, instanced: [], positions };
}

export function createPulseRings(scene) {
  const rings = [];
  const mat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.05, 64), mat.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    ring.userData.offset = i / 3;
    scene.add(ring);
    rings.push(ring);
  }
  return rings;
}
