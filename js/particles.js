import * as THREE from "three";

export function createParticleFlow(scene, count = 900) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const radii = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = 6 + Math.random() * 16;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = 0.8 + Math.random() * 7;
    positions[i * 3 + 2] = Math.sin(a) * r;
    phases[i] = Math.random() * Math.PI * 2;
    radii[i] = r;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x7dd3fc,
    size: 0.12,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  return {
    points,
    update(time, speedFactor = 1) {
      const pos = geometry.attributes.position.array;
      for (let i = 0; i < count; i += 1) {
        const base = phases[i];
        const r = radii[i];
        const w = 0.25 + (i % 7) * 0.03;
        const t = time * speedFactor + base;
        pos[i * 3] = Math.cos(t * w) * r;
        pos[i * 3 + 1] = 0.8 + ((base + time * speedFactor * 0.4) % 7);
        pos[i * 3 + 2] = Math.sin(t * w) * r;
      }
      geometry.attributes.position.needsUpdate = true;
    },
    setEnabled(enabled) {
      points.visible = enabled;
    },
  };
}

export function createStatusMarkers(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const colors = [0x38bdf8, 0x34d399, 0xfbbf24];
  const markers = [];

  for (let i = 0; i < 3; i += 1) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const r = 16;
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.3,
      }),
    );
    mesh.position.set(Math.cos(a) * r, 3.2 + i * 0.4, Math.sin(a) * r);
    mesh.userData.baseY = mesh.position.y;
    mesh.userData.phase = i * 1.7;
    group.add(mesh);
    markers.push(mesh);
  }

  return {
    group,
    markers,
    update(time) {
      markers.forEach((m) => {
        m.position.y = m.userData.baseY + Math.sin(time * 1.4 + m.userData.phase) * 0.25;
        m.rotation.y = time * 0.8 + m.userData.phase;
      });
    },
  };
}
