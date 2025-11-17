// game/rts/RTSState.js
import { Animation } from '/engine/Animation.js';
import { QuestManager } from "/engine/QuestManager.js";
import { NPC } from "/engine/NPC.js";
import { Item } from "/engine/Item.js";
import { drawHUD } from "/game/hud/HUD.js";


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
    
    // --- Cargar Sprites del Personaje ---
    const sD1 = this.loader.get('ChD1');
    const sD2 = this.loader.get('ChD2');
    const sD3 = this.loader.get('ChD3');
    const sU1 = this.loader.get('ChU1');
    const sU2 = this.loader.get('ChU2');
    const sU3 = this.loader.get('ChU3');
    const sR1 = this.loader.get('ChR1');
    const sR2 = this.loader.get('ChR2');
    const sR3 = this.loader.get('ChR3');
    const sL1 = this.loader.get('ChL1');
    const sL2 = this.loader.get('ChL2');
    const sL3 = this.loader.get('ChL3');

    // --- El Mundo ---
    this.worldWidth = 1888;
    this.worldHeight = 3072;

    // --- Canvas & Cámara ---
    this.canvasWidth = this.stateManager.canvas.width;
    this.canvasHeight = this.stateManager.canvas.height;
    this.camera = { x: 0, y: 0, width: this.canvasWidth, height: this.canvasHeight };

    // --- Entidades (MODIFICADO) ---
    this.player = {
      x: 100, y: 100,
      // --- LÍNEAS MODIFICADAS (Hitbox más pequeño) ---
      width: 5,  // Reducido de 24
      height: 5, // Reducido de 24
      // ------------------------------------
      speed: 150,
      direction: 'down',
      isMoving: false,
      spriteScale: 0.33, // Mantenemos el 50% de tamaño visual
      
      animations: {
        'idle_down': new Animation([sD2]),
        'idle_up': new Animation([sU2]),
        'idle_right': new Animation([sR2]),
        'idle_left': new Animation([sL2]),
        'walk_down': new Animation([sD1, sD2, sD1, sD3], 6),
        'walk_up': new Animation([sU1, sU2, sU1, sU3], 6),
        'walk_right': new Animation([sR1, sR2, sR1, sR3], 6),
        'walk_left': new Animation([sL1, sL2, sL1, sL3], 6)
      },
      currentAnimation: null
    };

    // Inicializar la animación actual
    this.player.currentAnimation = this.player.animations.idle_down;
    
    this.stairSpeed = this.player.speed * 0.7; 

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
    console.log("RTSState inicializado! Presiona 'P' para entrar al editor.");

    this.questManager = new QuestManager(this.player);

    // Crear NPCs
    this.npcAnciano = new NPC("npcAnciano", 300, 200);
    this.npcDestino  = new NPC("npcDestino", 800, 200);
    
    // Crear 5 gemas
    this.items = [
        new Item("gema1", 120, 140),
        new Item("gema2", 240, 160),
        new Item("gema3", 350, 180),
        new Item("gema4", 420, 200),
        new Item("gema5", 510, 240)
    ];

  }
  
  onResize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.camera.width = width;
    this.camera.height = height;
    this.centerCameraOnPlayer(); 
  }

  // --- (Funciones de Colisión, Cámara y Guardado no cambian) ---
  checkCollision(rectA, rectB) { return ( rectA.x < rectB.x + rectB.width && rectA.x + rectA.width > rectB.x && rectA.y < rectB.y + rectB.height && rectA.y + rectA.height > rectB.y ); }
  isCollidingWith(playerRect) { for (const rect of this.collisionRects) { if (this.checkCollision(playerRect, rect)) return true; } return false; }
  isInSlowZone(playerRect) { for (const rect of this.slowZones) { if (this.checkCollision(playerRect, rect)) return true; } return false; }
  isInStairZone(playerRect) { for (const rect of this.stairZones) { if (this.checkCollision(playerRect, rect)) return true; } return false; }
  centerCameraOnPlayer() { this.camera.x = this.player.x - (this.canvasWidth / 2) + (this.player.width / 2); this.camera.y = this.player.y - (this.canvasHeight / 2) + (this.player.height / 2); this.clampCamera(); }
  clampCamera() { this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.canvasWidth)); this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.canvasHeight)); }
  saveLevelDataToFile() { console.log("Guardando datos del nivel..."); const dataToSave = { collisions: this.collisionRects, slowZones: this.slowZones, stairZones: this.stairZones }; const data = JSON.stringify(dataToSave, null, 2); const blob = new Blob([data], { type: 'text/plain' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'level_data.txt'; link.click(); URL.revokeObjectURL(link.href); console.log("¡Archivo level_data.txt generado!"); }

  // --- UPDATE (MODIFICADO para Animación) ---
  update(dt) {
    // 1. Determinar velocidad
    let currentSpeed = this.player.speed;
    if (this.isInStairZone(this.player) && !this.debugMode) {
      currentSpeed = this.stairSpeed;
    } else if (this.isInSlowZone(this.player) && !this.debugMode) {
      currentSpeed = this.player.speed * 0.52;
    }

    // 2. Calcular nueva posición
    let newX = this.player.x, newY = this.player.y;
    this.player.isMoving = false; 

    if (this.keyState.w) { newY -= currentSpeed * dt; this.player.direction = 'up'; this.player.isMoving = true; }
    else if (this.keyState.s) { newY += currentSpeed * dt; this.player.direction = 'down'; this.player.isMoving = true; }
    else if (this.keyState.a) { newX -= currentSpeed * dt; this.player.direction = 'left'; this.player.isMoving = true; }
    else if (this.keyState.d) { newX += currentSpeed * dt; this.player.direction = 'right'; this.player.isMoving = true; }
    
    newX = Math.max(0, Math.min(newX, this.worldWidth - this.player.width));
    newY = Math.max(0, Math.min(newY, this.worldHeight - this.player.height));

    // 3. Comprobar colisiones
    if (!this.debugMode) {
      if (!this.isCollidingWith({ ...this.player, x: newX })) this.player.x = newX;
      if (!this.isCollidingWith({ ...this.player, y: newY })) this.player.y = newY;
    } else {
      this.player.x = newX; this.player.y = newY;
    }
    
    // 4. Actualizar cámara
    this.centerCameraOnPlayer();

    // 5. Actualizar Animación
    if (this.player.isMoving) {
      const walkAnim = this.player.animations[`walk_${this.player.direction}`];
      if (this.player.currentAnimation !== walkAnim) {
        this.player.currentAnimation = walkAnim;
        this.player.currentAnimation.reset();
      }
    } else {
      const idleAnim = this.player.animations[`idle_${this.player.direction}`];
      if (this.player.currentAnimation !== idleAnim) {
        this.player.currentAnimation = idleAnim;
        this.player.currentAnimation.reset();
      }
    }
    this.player.currentAnimation.update(dt);

    // 6. Lógica de Edición
    if (this.debugMode) {
      // --- LÓGICA DE FANTASMA MEJORADA ---
      // El fantasma ahora se basa en el centro del jugador
      const playerCenterX = this.player.x + this.player.width / 2;
      const playerCenterY = this.player.y + this.player.height / 2;
      this.ghostRect.x = Math.floor(playerCenterX / this.gridSize) * this.gridSize;
      this.ghostRect.y = Math.floor(playerCenterY / this.gridSize) * this.gridSize;
      // ---------------------------------
      
      const newRect = { ...this.ghostRect }; 
      
      if (this.keyPress.x) { if (!this.collisionRects.some(r => r.x === newRect.x && r.y === newRect.y)) { this.collisionRects.push(newRect); } this.keyPress.x = false; } 
      if (this.keyPress.l) { if (!this.slowZones.some(r => r.x === newRect.x && r.y === newRect.y)) { this.slowZones.push(newRect); } this.keyPress.l = false; } 
      if (this.keyPress.k) { if (!this.stairZones.some(r => r.x === newRect.x && r.y === newRect.y)) { this.stairZones.push(newRect); } this.keyPress.k = false; } 
      if (this.keyPress.b) { 
        this.collisionRects = this.collisionRects.filter(r => !(r.x === newRect.x && r.y === newRect.y)); 
        this.slowZones = this.slowZones.filter(r => !(r.x === newRect.x && r.y === newRect.y)); 
        this.stairZones = this.stairZones.filter(r => !(r.x === newRect.x && r.y === newRect.y)); 
        this.keyPress.b = false; 
      }
      if (this.keyPress.g) { this.saveLevelDataToFile(); this.keyPress.g = false; }
    }


    // 7. Comprobar Interacciones con NPCs
    for (const item of this.items) {
    if (!item.collected &&
        this.player.x < item.x + item.width &&
        this.player.x + this.player.width > item.x &&
        this.player.y < item.y + item.height &&
        this.player.y + this.player.height > item.y) {

        item.collected = true;
        this.questManager.actualizarProgreso();
    }
    }

  }

  // --- RENDER (No cambia) ---
  render(ctx) {
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    

    // 1. Dibujar Mundo
    ctx.fillStyle = '#0f0f10';
    ctx.fillRect(this.camera.x, this.camera.y, this.canvasWidth, this.canvasHeight);
    ctx.drawImage(this.bgSprite, 0, 0);

    // 2. Dibujar Personaje
    const frame = this.player.currentAnimation.getCurrentFrame();
    const scaledWidth = frame.width * this.player.spriteScale;
    const scaledHeight = frame.height * this.player.spriteScale;
    const drawX = this.player.x + (this.player.width / 2) - (scaledWidth / 2);
    const drawY = this.player.y + this.player.height - scaledHeight;
    ctx.drawImage(frame, drawX, drawY, scaledWidth, scaledHeight);
    // 3. Dibujar NPCs
    // dibujas mapa y objetos
    
    for (const item of this.items) item.render(ctx);
    this.npcAnciano.render(ctx);
    this.npcDestino.render(ctx);
    
    
    // 3. Dibujar Debug
    if (this.debugMode) {
      // (Dibujo de Colisiones, Zonas Lentas, Escaleras y Fantasma)
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)'; ctx.lineWidth = 2; for (const rect of this.collisionRects) { ctx.strokeRect(rect.x, rect.y, rect.width, rect.height); }
      ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; for (const rect of this.slowZones) { ctx.fillRect(rect.x, rect.y, rect.width, rect.height); }
      ctx.fillStyle = 'rgba(150, 0, 255, 0.3)'; for (const rect of this.stairZones) { ctx.fillRect(rect.x, rect.y, rect.width, rect.height); }
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; ctx.fillRect(this.ghostRect.x, this.ghostRect.y, this.ghostRect.width, this.ghostRect.height);
      
      // Dibujar el Hitbox del jugador (Rojo)
      // ESTE ES EL HITBOX NUEVO DE 16x16
      ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }

    ctx.restore();

    // 4. Dibujar la UI
    // (El código de la UI no cambia)
    ctx.fillStyle = '#eee'; ctx.font = '16px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Usa WASD para moverte', 10, 20);
    ctx.fillText(`Player X: ${Math.round(this.player.x)}, Player Y: ${Math.round(this.player.y)}`, 10, 40);
    ctx.fillStyle = this.debugMode ? 'lime' : 'red';
    ctx.fillText(`Debug (P): ${this.debugMode ? 'ON' : 'OFF'}`, 10, 60);

    if (this.debugMode) {
      ctx.fillStyle = 'lime';
      ctx.fillText("EDITOR: (X) Colisión | (L) Lento | (K) Escalera | (B) Borrar | (G) Guardar", 10, 80);
    }

    
    //this.player.render(ctx);

    // HUD
    drawHUD(ctx, this.questManager);

  }

  // --- (HandleInput no cambia) ---
  handleInput(event) {
    const key = event.key.toLowerCase();
    const isPressed = (event.type === "keydown");

    // --- Movimiento ---
    if (key === "w") this.keyState.w = isPressed;
    if (key === "a") this.keyState.a = isPressed;
    if (key === "s") this.keyState.s = isPressed;
    if (key === "d") this.keyState.d = isPressed;

    // --- Interactuar con NPC (E) ---
    if (key === "e" && isPressed) {
        if (this.interact) {
            this.interact();   // Llama al método que revisa distancia e interactúa
        }
    }

    // --- Debug Mode ---
    if (key === "p" && isPressed) {
        this.debugMode = !this.debugMode;
    }

    // --- Comandos debug ---
    if (this.debugMode && isPressed) {
        if (key === 'x') this.keyPress.x = true;
        if (key === 'b') this.keyPress.b = true;
        if (key === 'g') this.keyPress.g = true;
        if (key === 'l') this.keyPress.l = true;
        if (key === 'k') this.keyPress.k = true;
    }
}



interact() {
        if (this.distance(this.player, this.npcAnciano) < 40) {
            this.questManager.interactuarConNPC("npcAnciano");
        }

        if (this.distance(this.player, this.npcDestino) < 40) {
            this.questManager.interactuarConNPC("npcDestino");
        }
    }

    distance(a, b) {
        return Math.hypot((a.x - b.x), (a.y - b.y));
    }


  exit() {
    console.log("Saliendo de RTSState");
  }
}