// game/rts/RTSState.js
import { Animation } from '/engine/Animation.js';
import { QuestManager } from "/engine/QuestManager.js";
import { NPC } from "/engine/NPC.js";
import { Item } from "/engine/Item.js";
import { drawHUD } from "/game/hud/HUD.js";
import { PauseState } from './PauseState.js';
import { GameOverState } from './GameOverState.js';


export class RTSState {
  
  createFlippedSprite(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.scale(-1, 1);
    ctx.drawImage(image, -image.width, 0);
    return canvas;
  }

  init(stateManager) {
    this.stateManager = stateManager;
    this.loader = this.stateManager.loader;

    // --- Cargar Assets ---
    this.bgSprite = this.loader.get('background');
    const levelData = this.loader.get('levelData');
    
    // Sprites del Personaje
    const sD1 = this.loader.get('ChD1'), sD2 = this.loader.get('ChD2'), sD3 = this.loader.get('ChD3');
    const sU1 = this.loader.get('ChU1'), sU2 = this.loader.get('ChU2'), sU3 = this.loader.get('ChU3');
    const sR1 = this.loader.get('ChR1'), sR2 = this.loader.get('ChR2'), sR3 = this.loader.get('ChR3');
    const sL1 = this.loader.get('ChL1'), sL2 = this.loader.get('ChL2'), sL3 = this.loader.get('ChL3');

    // Sprites de Entidades
    const gemSprite = this.loader.get('gem');
    const npcSprite = this.loader.get('npc');
    const targetSprite = this.loader.get('target');

    // --- El Mundo ---
    this.worldWidth = 1888;
    this.worldHeight = 3072;

    // --- Canvas & Cámara ---
    this.canvasWidth = this.stateManager.canvas.width;
    this.canvasHeight = this.stateManager.canvas.height;
    this.camera = { x: 0, y: 0, width: this.canvasWidth, height: this.canvasHeight };

    // --- Entidades ---
    this.player = {
      x: 55, y: 440, // <-- SPAWN CORREGIDO
      width: 5, height: 5, // Tu hitbox
      speed: 150,
      direction: 'down',
      isMoving: false,
      spriteScale: 0.33, // Tu escala
      animations: {
        'idle_down': new Animation([sD2]), 'idle_up': new Animation([sU2]), 'idle_right': new Animation([sR2]), 'idle_left': new Animation([sL2]),
        'walk_down': new Animation([sD1, sD2, sD1, sD3], 6), 'walk_up': new Animation([sU1, sU2, sU1, sU3], 6),
        'walk_right': new Animation([sR1, sR2, sR1, sR3], 6), 'walk_left': new Animation([sL1, sL2, sL1, sL3], 6)
      },
      currentAnimation: null
    };
    this.player.currentAnimation = this.player.animations.idle_down;
    this.stairSpeed = this.player.speed * 0.7; 

    // --- Misiones ---
    this.questManager = new QuestManager(this.player);

    // --- NPCs y Gemas (COORDENADAS CORREGIDAS) ---
    this.npcAnciano = new NPC("npcAnciano", 339, 2611, npcSprite);
    this.npcDestino = new NPC("npcDestino", 1682, 892, targetSprite);
    
    this.items = [
      new Item("gema1", 495, 592, gemSprite),
      new Item("gema2", 498, 1369, gemSprite),
      new Item("gema3", 1233, 1670, gemSprite),
      new Item("gema4", 1440, 2850, gemSprite),
      new Item("gema5", 1455, 2233, gemSprite)
    ];

    // --- Colisiones ---
    this.collisionRects = levelData.collisions;
    this.slowZones = levelData.slowZones;
    this.stairZones = levelData.stairZones;
    
    // --- Input y Debug ---
    this.keyState = { w: false, a: false, s: false, d: false };
    this.debugMode = false;
    
    // --- Modo de Edición ---
    this.gridSize = 32;
    this.ghostRect = { x: 0, y: 0, width: this.gridSize, height: this.gridSize };
    this.keyPress = { x: false, b: false, g: false, l: false, k: false };

    this.centerCameraOnPlayer();
    console.log("RTSState inicializado! 'P' para editor, 'Esc' para pausa, 'E' para interactuar.");
  }
  
  onResize(width, height) { this.canvasWidth = width; this.canvasHeight = height; this.camera.width = width; this.camera.height = height; this.centerCameraOnPlayer(); }
  checkCollision(rectA, rectB) { return ( rectA.x < rectB.x + rectB.width && rectA.x + rectA.width > rectB.x && rectA.y < rectB.y + rectB.height && rectA.y + rectA.height > rectB.y ); }
  isCollidingWith(playerRect) { for (const rect of this.collisionRects) { if (this.checkCollision(playerRect, rect)) return true; } return false; }
  isInSlowZone(playerRect) { for (const rect of this.slowZones) { if (this.checkCollision(playerRect, rect)) return true; } return false; }
  isInStairZone(playerRect) { for (const rect of this.stairZones) { if (this.checkCollision(playerRect, rect)) return true; } return false; }
  centerCameraOnPlayer() { this.camera.x = this.player.x - (this.canvasWidth / 2) + (this.player.width / 2); this.camera.y = this.player.y - (this.canvasHeight / 2) + (this.player.height / 2); this.clampCamera(); }
  clampCamera() { this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.canvasWidth)); this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.canvasHeight)); }
  saveLevelDataToFile() { console.log("Guardando datos del nivel..."); const dataToSave = { collisions: this.collisionRects, slowZones: this.slowZones, stairZones: this.stairZones }; const data = JSON.stringify(dataToSave, null, 2); const blob = new Blob([data], { type: 'text/plain' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'level_data.txt'; link.click(); URL.revokeObjectURL(link.href); console.log("¡Archivo level_data.txt generado!"); }
  
  // --- MÉTODOS MOVIDOS DENTRO DE LA CLASE ---
  distance(a, b) {
    return Math.hypot((a.x - b.x), (a.y - b.y));
  }

  interact() {
    // Revisa si está cerca del anciano
    if (this.distance(this.player, this.npcAnciano) < 40) { // 40px de rango
        this.questManager.interactuarConNPC("npcAnciano");
        return; // Solo interactúa con uno a la vez
    }
    // Revisa si está cerca del destino
    if (this.distance(this.player, this.npcDestino) < 40) {
        this.questManager.interactuarConNPC("npcDestino");
        return;
    }
  }

  // --- UPDATE (Lógica Principal) ---
  update(dt) {
    let currentSpeed = this.player.speed;
    if (this.isInStairZone(this.player) && !this.debugMode) currentSpeed = this.stairSpeed;
    else if (this.isInSlowZone(this.player) && !this.debugMode) currentSpeed = this.player.speed * 0.5;

    let newX = this.player.x, newY = this.player.y;
    this.player.isMoving = false; 

    if (this.keyState.w) { newY -= currentSpeed * dt; this.player.direction = 'up'; this.player.isMoving = true; }
    else if (this.keyState.s) { newY += currentSpeed * dt; this.player.direction = 'down'; this.player.isMoving = true; }
    else if (this.keyState.a) { newX -= currentSpeed * dt; this.player.direction = 'left'; this.player.isMoving = true; }
    else if (this.keyState.d) { newX += currentSpeed * dt; this.player.direction = 'right'; this.player.isMoving = true; }
    
    newX = Math.max(0, Math.min(newX, this.worldWidth - this.player.width));
    newY = Math.max(0, Math.min(newY, this.worldHeight - this.player.height));

    if (!this.debugMode) {
      if (!this.isCollidingWith({ ...this.player, x: newX })) this.player.x = newX;
      if (!this.isCollidingWith({ ...this.player, y: newY })) this.player.y = newY;
    } else {
      this.player.x = newX; this.player.y = newY;
    }
    
    this.centerCameraOnPlayer();

    if (this.player.isMoving) {
      const walkAnim = this.player.animations[`walk_${this.player.direction}`];
      if (this.player.currentAnimation !== walkAnim) this.player.currentAnimation = walkAnim;
    } else {
      const idleAnim = this.player.animations[`idle_${this.player.direction}`];
      if (this.player.currentAnimation !== idleAnim) this.player.currentAnimation = idleAnim;
    }
    this.player.currentAnimation.update(dt);

    if (this.debugMode) {
      const playerCenterX = this.player.x + this.player.width / 2;
      const playerCenterY = this.player.y + this.player.height / 2;
      this.ghostRect.x = Math.floor(playerCenterX / this.gridSize) * this.gridSize;
      this.ghostRect.y = Math.floor(playerCenterY / this.gridSize) * this.gridSize;
      const newRect = { ...this.ghostRect }; 
      if (this.keyPress.x) { if (!this.collisionRects.some(r => r.x === newRect.x && r.y === newRect.y)) { this.collisionRects.push(newRect); } this.keyPress.x = false; } 
      if (this.keyPress.l) { if (!this.slowZones.some(r => r.x === newRect.x && r.y === newRect.y)) { this.slowZones.push(newRect); } this.keyPress.l = false; } 
      if (this.keyPress.k) { if (!this.stairZones.some(r => r.x === newRect.x && r.y === newRect.y)) { this.stairZones.push(newRect); } this.keyPress.k = false; } 
      if (this.keyPress.b) { this.collisionRects = this.collisionRects.filter(r => !(r.x === newRect.x && r.y === newRect.y)); this.slowZones = this.slowZones.filter(r => !(r.x === newRect.x && r.y === newRect.y)); this.stairZones = this.stairZones.filter(r => !(r.x === newRect.x && r.y === newRect.y)); this.keyPress.b = false; }
      if (this.keyPress.g) { this.saveLevelDataToFile(); this.keyPress.g = false; }
    }

    // Lógica del juego (Colisionar con items)
    for (const item of this.items) {
      if (!item.collected && this.checkCollision(this.player, item)) {
          item.collected = true;
          this.questManager.actualizarProgreso();
      }
    }
    // Condición de victoria
    if (this.questManager.getMisionActual().id === "fin") {
      this.stateManager.set(new GameOverState());
    }
  }

  // --- RENDER ---
  render(ctx) {
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Dibujar Mundo
    ctx.fillStyle = '#0f0f10';
    ctx.fillRect(this.camera.x, this.camera.y, this.canvasWidth, this.canvasHeight);
    ctx.drawImage(this.bgSprite, 0, 0);
    
    // 2. Dibujar Entidades (Items, NPCs)
    for (const item of this.items) item.render(ctx, 0.025); // Tu escala 0.025
    this.npcAnciano.render(ctx, 0.5);
    this.npcDestino.render(ctx, 1.0);

    // 3. Dibujar Personaje
    const frame = this.player.currentAnimation.getCurrentFrame();
    const scaledWidth = frame.width * this.player.spriteScale;
    const scaledHeight = frame.height * this.player.spriteScale;
    const drawX = this.player.x + (this.player.width / 2) - (scaledWidth / 2);
    const drawY = this.player.y + this.player.height - scaledHeight;
    ctx.drawImage(frame, drawX, drawY, scaledWidth, scaledHeight);

    // 4. Dibujar Debug
    if (this.debugMode) {
      // Zonas
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)'; ctx.lineWidth = 2; for (const rect of this.collisionRects) { ctx.strokeRect(rect.x, rect.y, rect.width, rect.height); }
      ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; for (const rect of this.slowZones) { ctx.fillRect(rect.x, rect.y, rect.width, rect.height); }
      ctx.fillStyle = 'rgba(150, 0, 255, 0.3)'; for (const rect of this.stairZones) { ctx.fillRect(rect.x, rect.y, rect.width, rect.height); }
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; ctx.fillRect(this.ghostRect.x, this.ghostRect.y, this.ghostRect.width, this.ghostRect.height);
      
      // Hitboxes
      ctx.strokeStyle = 'rgba(255, 0, 0, 1)'; ctx.lineWidth = 1;
      ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
      ctx.strokeStyle = 'rgba(0, 255, 0, 1)'; // Verde
      for (const item of this.items) if(!item.collected) ctx.strokeRect(item.x, item.y, item.width, item.height);
      ctx.strokeRect(this.npcAnciano.x, this.npcAnciano.y, this.npcAnciano.width, this.npcAnciano.height);
      ctx.strokeRect(this.npcDestino.x, this.npcDestino.y, this.npcDestino.width, this.npcDestino.height);
    }

    ctx.restore();

    // 5. Dibujar la UI (HUD)
    ctx.fillStyle = '#eee'; ctx.font = '16px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Usa WASD para moverte', 10, 20);
    ctx.fillText(`Player X: ${Math.round(this.player.x)}, Player Y: ${Math.round(this.player.y)}`, 10, 40);
    ctx.fillStyle = this.debugMode ? 'lime' : 'red';
    ctx.fillText(`Debug (P): ${this.debugMode ? 'ON' : 'OFF'}`, 10, 60);
    if (this.debugMode) {
      ctx.fillStyle = 'lime';
      ctx.fillText("EDITOR: (X) Colisión | (L) Lento | (K) Escalera | (B) Borrar | (G) Guardar", 10, 80);
    }
    
    // Dibuja el HUD de misiones
    drawHUD(ctx, this.questManager);
  }

  // --- Manejo de Input ---
  handleInput(event) {
    if (event.type === 'keydown' || event.type === 'keyup') {
      const key = event.key.toLowerCase();
      const isPressed = (event.type === 'keydown');
      
      if (key === 'w') this.keyState.w = isPressed;
      if (key === 'a') this.keyState.a = isPressed;
      if (key === 's') this.keyState.s = isPressed;
      if (key === 'd') this.keyState.d = isPressed;

      if (key === 'p' && isPressed) { this.debugMode = !this.debugMode; }
      
      // Pausa (Escape o U como respaldo)
      if ((key === 'escape' || key === 'u') && isPressed) {
        this.stateManager.push(new PauseState());
      }
      
      // Interactuar
      if (key === 'e' && isPressed) {
        this.interact(); // Llama a la función interact()
      }

      // Editor
      if (this.debugMode && isPressed) {
        if (key === 'x') this.keyPress.x = true;
        if (key === 'b') this.keyPress.b = true;
        if (key === 'g') this.keyPress.g = true;
        if (key === 'l') this.keyPress.l = true;
        if (key === 'k') this.keyPress.k = true;
      }
    }
  }

  exit() {
    console.log("Saliendo de RTSState");
  }
}