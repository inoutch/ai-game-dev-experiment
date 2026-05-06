import './style.css';
import * as THREE from 'three';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('app root not found');

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x1b2438, 40, 150);

const camera = new THREE.PerspectiveCamera(62, 9 / 16, 0.1, 500);
camera.position.set(0, 5.6, -11.5);
camera.lookAt(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x10172a);
app.append(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xbad9ff, 0x3f3224, 1.1);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(12, 20, -16);
scene.add(sun);

const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x22262f, roughness: 0.8 });
const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x777777 });
const turfMaterial = new THREE.MeshStandardMaterial({ color: 0x2f7a46, roughness: 1 });

const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 500), turfMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.z = 140;
scene.add(ground);

const road = new THREE.Mesh(new THREE.PlaneGeometry(9, 500), roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.02;
road.position.z = 140;
scene.add(road);

for (let i = 0; i < 120; i += 1) {
  const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 1.4), lineMaterial);
  dash.rotation.x = -Math.PI / 2;
  dash.position.set(0, 0.04, i * 4);
  scene.add(dash);
}

const player = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.8, 2.1),
  new THREE.MeshStandardMaterial({ color: 0xe64545, metalness: 0.2, roughness: 0.4 })
);
player.position.set(0, 0.45, 0);
scene.add(player);

const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x4f7dff });
const enemies: THREE.Mesh[] = [];
for (let i = 0; i < 14; i += 1) {
  const enemy = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 2), enemyMaterial);
  enemy.position.set((Math.random() - 0.5) * 6.4, 0.45, 20 + i * 18);
  enemies.push(enemy);
  scene.add(enemy);
}

const overlay = document.createElement('div');
overlay.className = 'overlay';
overlay.innerHTML = `
  <div class="hud">
    <div class="card" id="speed">Speed 0 km/h</div>
    <div class="card" id="score">Score 0</div>
  </div>
  <div class="controls">
    <button class="btn" id="left">◀</button>
    <button class="btn" id="right">▶</button>
  </div>
`;
app.append(overlay);

const speedLabel = document.getElementById('speed')!;
const scoreLabel = document.getElementById('score')!;
const leftBtn = document.getElementById('left') as HTMLButtonElement;
const rightBtn = document.getElementById('right') as HTMLButtonElement;

const input = { left: false, right: false };
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') input.left = true;
  if (e.key === 'ArrowRight') input.right = true;
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') input.left = false;
  if (e.key === 'ArrowRight') input.right = false;
});

const bindPress = (button: HTMLButtonElement, key: 'left' | 'right'): void => {
  button.addEventListener('pointerdown', () => (input[key] = true));
  button.addEventListener('pointerup', () => (input[key] = false));
  button.addEventListener('pointerleave', () => (input[key] = false));
};
bindPress(leftBtn, 'left');
bindPress(rightBtn, 'right');

let speed = 0;
let score = 0;
let alive = true;
const clock = new THREE.Clock();

const resize = (): void => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};
window.addEventListener('resize', resize);
resize();

const animate = (): void => {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (alive) {
    speed = Math.min(210, speed + dt * 30);
    if (input.left) player.position.x -= dt * 6;
    if (input.right) player.position.x += dt * 6;
    player.position.x = THREE.MathUtils.clamp(player.position.x, -3.4, 3.4);

    score += dt * speed * 0.8;
    speedLabel.textContent = `Speed ${Math.round(speed)} km/h`;
    scoreLabel.textContent = `Score ${Math.round(score)}`;

    enemies.forEach((enemy) => {
      enemy.position.z -= dt * (speed * 0.28 + 8);
      if (enemy.position.z < -20) {
        enemy.position.z = 220 + Math.random() * 120;
        enemy.position.x = (Math.random() - 0.5) * 6.8;
      }
      const hit =
        Math.abs(enemy.position.z - player.position.z) < 1.7 &&
        Math.abs(enemy.position.x - player.position.x) < 1.2;
      if (hit) {
        alive = false;
        scoreLabel.textContent = `Crashed! Score ${Math.round(score)} (reload)`;
      }
    });
  }

  camera.position.x += (player.position.x * 0.6 - camera.position.x) * 0.08;
  camera.position.z = player.position.z - 11.5;
  camera.lookAt(player.position.x * 0.2, 0.4, player.position.z + 12);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();
