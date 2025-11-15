// main.js
import { StateManager } from './engine/stateManager.js';
import { AssetLoader } from './engine/loader.js';
import { LoadingState } from './game/LoadingState.js';

// --- Configuración Inicial ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let last = 0;

const loader = new AssetLoader();
// --- MODIFICADO: Pasamos el canvas al manager ---
const stateManager = new StateManager(loader, canvas); 

// --- Estado Inicial ---
stateManager.set(new LoadingState());

// --- NUEVO: Función de Redimensionado ---
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false; // Importante: resetear esto tras redimensionar

  // Avisar al estado actual sobre el nuevo tamaño
  const activeState = stateManager.getActiveState();
  if (activeState && activeState.onResize) {
    activeState.onResize(canvas.width, canvas.height);
  }
}

// --- Game Loop Principal ---
function loop(ts) {
  // Delta time (dt) en segundos
  const dt = (ts - last) / 1000;
  last = ts;
  
  stateManager.update(dt);
  stateManager.render(ctx);

  requestAnimationFrame(loop);
}

// --- Event Listeners ---
window.addEventListener('mousedown', (e) => stateManager.handleInput(e));
window.addEventListener('mouseup', (e) => stateManager.handleInput(e));
window.addEventListener('mousemove', (e) => stateManager.handleInput(e));
window.addEventListener('contextmenu', (e) => {
  e.preventDefault(); 
  stateManager.handleInput(e);
});
window.addEventListener('keydown', (e) => stateManager.handleInput(e));
window.addEventListener('keyup', (e) => stateManager.handleInput(e));

// --- NUEVO: Listener de Redimensionado ---
window.addEventListener('resize', resizeCanvas);

// --- Iniciar el juego y Ajustar tamaño inicial ---
resizeCanvas(); // <-- Llamamos una vez al inicio
requestAnimationFrame(loop);