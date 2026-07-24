import * as THREE from './vendor/three.module.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

const basePositions = {
  shell: new THREE.Vector3(0, 0.82, 0),
  drivers: new THREE.Vector3(0, 0.82, 0),
  core: new THREE.Vector3(0, -0.02, 0),
  plinth: new THREE.Vector3(0, -1.24, 0),
};

const explodedOffsets = {
  shell: 1.08,
  drivers: 0.5,
  core: -0.26,
  plinth: -0.48,
};

export class HaloScene {
  constructor(canvas, { reducedMotion = false, onUnavailable = () => {} } = {}) {
    this.canvas = canvas;
    this.onUnavailable = onUnavailable;
    this.reducedMotion = Boolean(reducedMotion);
    this.disposed = false;
    this.frame = 0;
    this.energy = 0;
    this.stage = 0;
    this.exploded = false;
    this.pointer = new THREE.Vector2();
    this.dragStart = new THREE.Vector2();
    this.dragRotation = new THREE.Vector2();
    this.materials = new Set();
    this.geometries = new Set();
    this.cameraDistance = 7.2;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.resize = this.resize.bind(this);

    try {
      if (!canvas) throw new Error('HALO requires a canvas element.');

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x090a0b, 0.085);
      this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
      this.root = new THREE.Group();
      this.scene.add(this.root);
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      this.renderer.setClearColor(0x090a0b, 0);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.28;

      this.parts = {
        shell: new THREE.Group(),
        drivers: new THREE.Group(),
        core: new THREE.Group(),
        plinth: new THREE.Group(),
      };
      Object.entries(this.parts).forEach(([name, part]) => {
        part.position.copy(basePositions[name]);
        this.root.add(part);
      });

      this.buildProduct();
      this.addLights();
      this.addListeners();
      this.resize();
      this.setMode('assembled');
      this.setExploded(false);
      this.setEnergy(0);
      this.setStage(0);
      this.render(0);
      this.scheduleRender();
    } catch (error) {
      this.markUnavailable(error);
      try { this.onUnavailable(error); } catch { /* Fallback notification is optional. */ }
    }
  }

  createMaterial(options) {
    const material = new THREE.MeshStandardMaterial(options);
    this.materials.add(material);
    return material;
  }

  createMesh(geometry, material) {
    this.geometries.add(geometry);
    return new THREE.Mesh(geometry, material);
  }

  buildProduct() {
    this.shellMaterial = this.createMaterial({
      color: 0x383a38,
      emissive: 0x24170f,
      emissiveIntensity: 0.16,
      metalness: 0.5,
      roughness: 0.32,
      transparent: true,
      opacity: 1,
    });
    this.driverMaterial = this.createMaterial({
      color: 0x4b4038,
      emissive: 0x2f1b10,
      emissiveIntensity: 0.16,
      metalness: 0.4,
      roughness: 0.34,
      transparent: true,
      opacity: 0.84,
    });
    this.coreMaterial = this.createMaterial({
      color: 0x754226,
      emissive: 0xc46e2a,
      emissiveIntensity: 0.38,
      metalness: 0.76,
      roughness: 0.22,
      transparent: true,
      opacity: 0.92,
    });
    this.plinthMaterial = this.createMaterial({
      color: 0x6a361f,
      emissive: 0x2b1008,
      emissiveIntensity: 0.14,
      metalness: 0.76,
      roughness: 0.3,
      transparent: true,
      opacity: 1,
    });

    const shell = this.createMesh(new THREE.TorusGeometry(1.7, 0.25, 32, 112), this.shellMaterial);
    shell.rotation.x = Math.PI / 2;
    this.parts.shell.add(shell);

    const shellInset = this.createMesh(new THREE.TorusGeometry(1.45, 0.045, 16, 96), this.coreMaterial);
    shellInset.rotation.x = Math.PI / 2;
    this.parts.shell.add(shellInset);

    const driverGeometry = new THREE.CylinderGeometry(0.16, 0.19, 0.075, 24);
    this.geometries.add(driverGeometry);
    for (let index = 0; index < 12; index += 1) {
      const angle = index / 12 * Math.PI * 2;
      const driver = new THREE.Mesh(driverGeometry, this.driverMaterial);
      driver.position.set(Math.cos(angle) * 1.69, 0, Math.sin(angle) * 1.69);
      driver.rotation.x = Math.PI / 2;
      driver.rotation.z = -angle;
      this.parts.drivers.add(driver);
    }

    const coreRing = this.createMesh(new THREE.TorusGeometry(0.58, 0.11, 20, 64), this.coreMaterial);
    coreRing.rotation.x = Math.PI / 2;
    this.parts.core.add(coreRing);
    const coreColumn = this.createMesh(new THREE.CylinderGeometry(0.24, 0.32, 0.5, 32), this.coreMaterial);
    this.parts.core.add(coreColumn);
    const coreCap = this.createMesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 32), this.shellMaterial);
    coreCap.position.y = 0.28;
    this.parts.core.add(coreCap);

    const profile = new THREE.Shape();
    profile.moveTo(-1.1, -0.38);
    profile.lineTo(1.1, -0.38);
    profile.lineTo(1.18, -0.3);
    profile.lineTo(1.18, 0.3);
    profile.lineTo(1.1, 0.38);
    profile.lineTo(-1.1, 0.38);
    profile.lineTo(-1.18, 0.3);
    profile.lineTo(-1.18, -0.3);
    profile.closePath();
    const plinth = this.createMesh(new THREE.ExtrudeGeometry(profile, {
      depth: 1.48,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }), this.plinthMaterial);
    plinth.position.set(0, 0, -0.74);
    this.parts.plinth.add(plinth);

    const plinthRing = this.createMesh(new THREE.TorusGeometry(0.86, 0.035, 12, 64), this.coreMaterial);
    plinthRing.scale.y = 0.42;
    plinthRing.position.y = 0.44;
    this.parts.plinth.add(plinthRing);
  }

  addLights() {
    const ambient = new THREE.HemisphereLight(0xffefe1, 0x16120f, 1.5);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffe6cf, 3.4);
    key.position.set(3.6, 4.2, 4.4);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xd8c5b2, 2.1);
    fill.position.set(-4.6, 1.8, 3.2);
    this.scene.add(fill);

    this.rimLight = new THREE.PointLight(0xe58a4d, 9.5, 10, 2);
    this.rimLight.position.set(0, 2.1, -2.4);
    this.scene.add(this.rimLight);
  }

  addListeners() {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointercancel', this.handlePointerUp);
    this.canvas.addEventListener('pointerleave', this.handlePointerUp);
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    this.canvas.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.resize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  removeListeners() {
    this.canvas?.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas?.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas?.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas?.removeEventListener('pointercancel', this.handlePointerUp);
    this.canvas?.removeEventListener('pointerleave', this.handlePointerUp);
    this.canvas?.removeEventListener('wheel', this.handleWheel);
    this.canvas?.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handlePointerDown(event) {
    if (this.reducedMotion || this.disposed) return;
    this.canvas.setPointerCapture?.(event.pointerId);
    this.dragging = true;
    this.dragStart.set(event.clientX, event.clientY);
    this.dragRotation.set(this.pointer.x, this.pointer.y);
  }

  handlePointerMove(event) {
    if (!this.dragging || this.reducedMotion || this.disposed) return;
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.pointer.x = clamp(this.dragRotation.x + (event.clientX - this.dragStart.x) / width * 1.7, -0.85, 0.85);
    this.pointer.y = clamp(this.dragRotation.y + (event.clientY - this.dragStart.y) / height * 0.7, -0.28, 0.28);
    this.render(performance.now());
  }

  handlePointerUp(event) {
    this.dragging = false;
    if (event?.pointerId !== undefined && this.canvas?.hasPointerCapture?.(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
  }

  handleWheel(event) {
    if (this.disposed) return;
    event.preventDefault();
    this.cameraDistance = clamp(this.cameraDistance + event.deltaY * 0.003, 5.2, 8.5);
    this.updateCamera();
    this.render(performance.now());
  }

  handleKeyDown(event) {
    if (this.disposed) return;

    const actions = {
      ArrowLeft: () => { this.pointer.x = clamp(this.pointer.x - 0.08, -0.85, 0.85); },
      ArrowRight: () => { this.pointer.x = clamp(this.pointer.x + 0.08, -0.85, 0.85); },
      ArrowUp: () => { this.pointer.y = clamp(this.pointer.y - 0.06, -0.28, 0.28); },
      ArrowDown: () => { this.pointer.y = clamp(this.pointer.y + 0.06, -0.28, 0.28); },
      '+': () => { this.cameraDistance = clamp(this.cameraDistance - 0.25, 5.2, 8.5); },
      '=': () => { this.cameraDistance = clamp(this.cameraDistance - 0.25, 5.2, 8.5); },
      PageUp: () => { this.cameraDistance = clamp(this.cameraDistance - 0.25, 5.2, 8.5); },
      '-': () => { this.cameraDistance = clamp(this.cameraDistance + 0.25, 5.2, 8.5); },
      PageDown: () => { this.cameraDistance = clamp(this.cameraDistance + 0.25, 5.2, 8.5); },
    };
    const action = actions[event.key];
    if (!action) return;

    event.preventDefault();
    action();
    this.updateCamera();
    this.render(performance.now());
  }

  handleVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      return;
    }
    this.render(performance.now());
    this.scheduleRender();
  }

  setMode(mode) {
    if (this.unavailable || this.disposed) return;
    const modes = {
      assembled: { shell: 1, drivers: 0.84, core: 0.92, plinth: 1, shellGlow: 0.12, coreGlow: 0.38 },
      shell: { shell: 1, drivers: 0.42, core: 0.5, plinth: 0.64, shellGlow: 0.28, coreGlow: 0.18 },
      core: { shell: 0.48, drivers: 0.52, core: 1, plinth: 0.68, shellGlow: 0.08, coreGlow: 0.74 },
    };
    const next = modes[mode] || modes.assembled;
    this.mode = modes[mode] ? mode : 'assembled';
    this.shellMaterial.opacity = next.shell;
    this.driverMaterial.opacity = next.drivers;
    this.coreMaterial.opacity = next.core;
    this.plinthMaterial.opacity = next.plinth;
    this.modeShellGlow = next.shellGlow;
    this.modeCoreGlow = next.coreGlow;
    this.applyEnergy();
    this.render(performance.now());
  }

  setExploded(value) {
    if (this.unavailable || this.disposed) return;
    this.exploded = Boolean(value);
    Object.entries(this.parts).forEach(([name, part]) => {
      part.position.copy(basePositions[name]);
      if (this.exploded) part.position.y += explodedOffsets[name];
    });
    this.render(performance.now());
  }

  setEnergy(value) {
    if (this.unavailable || this.disposed) return;
    this.energy = clamp(Number(value) || 0, 0, 1);
    this.applyEnergy();
    this.render(performance.now());
  }

  applyEnergy() {
    if (!this.shellMaterial) return;
    this.shellMaterial.emissiveIntensity = this.modeShellGlow + this.energy * 0.18;
    this.coreMaterial.emissiveIntensity = this.modeCoreGlow + this.energy * 1.8;
    this.driverMaterial.emissiveIntensity = 0.16 + this.energy * 0.18;
    this.plinthMaterial.emissiveIntensity = 0.12 + this.energy * 0.1;
    this.rimLight.intensity = 3.2 + this.energy * 11;
    const scale = 1 + this.energy * 0.026;
    this.parts.core.scale.setScalar(scale);
  }

  setStage(progress) {
    if (this.unavailable || this.disposed) return;
    this.stage = clamp(Number(progress) || 0, 0, 1);
    this.stageDistance = 7.65 - this.stage * 1.75;
    this.stageRotationY = -0.24 + this.stage * 0.58;
    this.stageRotationX = -0.08 + this.stage * 0.16;
    this.updateCamera();
    this.render(performance.now());
  }

  updateCamera() {
    if (!this.camera || !this.root) return;
    const distance = clamp(this.cameraDistance + ((this.stageDistance ?? 7.2) - 7.2), 5.2, 8.5);
    this.camera.position.set(0, 0.48, distance);
    this.camera.lookAt(0, -0.06, 0);
    this.root.rotation.y = (this.stageRotationY || 0) + this.pointer.x;
    this.root.rotation.x = (this.stageRotationX || 0) + this.pointer.y;
  }

  resize() {
    if (this.unavailable || this.disposed || !this.renderer || !this.camera) return;
    const width = Math.max(1, this.canvas.clientWidth || window.innerWidth);
    const height = Math.max(1, this.canvas.clientHeight || window.innerHeight);
    const pixelRatioCap = width < 760 ? 1.35 : 1.75;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render(performance.now());
  }

  scheduleRender() {
    if (this.disposed || this.reducedMotion || document.hidden || this.frame) return;
    this.frame = requestAnimationFrame((time) => {
      this.frame = 0;
      this.render(time);
      this.scheduleRender();
    });
  }

  render(time = 0) {
    if (this.disposed || !this.renderer || document.hidden) return;
    this.updateCamera();
    if (!this.reducedMotion && this.rimLight) {
      const orbit = time * 0.00045;
      this.rimLight.position.set(Math.cos(orbit) * 2.2, 1.85 + Math.sin(orbit * 1.7) * 0.35, Math.sin(orbit) * 2.2 - 1.4);
    }
    this.renderer.render(this.scene, this.camera);
  }

  markUnavailable(error) {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.unavailable = true;
    this.canvas?.parentElement?.classList.add('webgl-unavailable');
    this.dispose();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.removeListeners();
    this.geometries.forEach((geometry) => geometry.dispose());
    this.materials.forEach((material) => material.dispose());
    this.renderer?.renderLists?.dispose();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss?.();
    this.scene?.clear();
    this.geometries.clear();
    this.materials.clear();
  }
}
