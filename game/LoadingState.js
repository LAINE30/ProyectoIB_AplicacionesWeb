// game/LoadingState.js (Corregido)
import { MenuState } from './rts/MenuState.js';

export class LoadingState {
  
  init(stateManager) {
    this.stateManager = stateManager;
    this.loader = this.stateManager.loader;
    this.assetsLoaded = false;
    
    this.loadAssets();
  }

  async loadAssets() {
  // 1. Cargar assets del mundo
  this.loader.loadImage('background', 'assets/magecity.png');
  // Fondo del menú principal
  this.loader.loadImage('menuBackground', 'assets/Fondos/fondo_menu.jpg');
    
    // 2. Cargar todos los sprites del personaje
    this.loader.loadImage('ChD1', 'assets/ChD1.png');
    this.loader.loadImage('ChD2', 'assets/ChD2.png'); // <-- ¡AQUÍ ESTABA EL ERROR!
    this.loader.loadImage('ChD3', 'assets/ChD3.png');
    
    this.loader.loadImage('ChU1', 'assets/ChU1.png');
    this.loader.loadImage('ChU2', 'assets/ChU2.png');
    this.loader.loadImage('ChU3', 'assets/ChU3.png');
    
    this.loader.loadImage('ChR1', 'assets/ChR1.png');
    this.loader.loadImage('ChR2', 'assets/ChR2.png');
    this.loader.loadImage('ChR3', 'assets/ChR3.png');
    
    this.loader.loadImage('ChL1', 'assets/ChL1.png');
    this.loader.loadImage('ChL2', 'assets/ChL2.png');
    this.loader.loadImage('ChL3', 'assets/ChL3.png');

    // Espera a que se carguen las imágenes
    await this.loader.loadAll();

    // 3. Cargar datos del nivel
    try {
      const response = await fetch('assets/level_data.txt');
      if (response.ok) {
        const data = await response.json();
        this.loader.assets.set('levelData', data);
        console.log("Datos del nivel cargados.");
      } else {
        throw new Error('No se encontró level_data.txt.');
      }
    } catch (error) {
      console.warn(error.message, "Iniciando con datos de nivel vacíos.");
      this.loader.assets.set('levelData', {
        collisions: [], slowZones: [], stairZones: []
      });
    }

    this.assetsLoaded = true;
  }

  update(dt) {
    if (this.assetsLoaded) {
      this.stateManager.set(new MenuState());
    }
  }

  render(ctx) {
    // (Barra de carga - sin cambios)
    const progress = this.loader.getProgress();
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.fillStyle = '#0f0f10';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#eee';
    ctx.font = '20px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`Cargando... ${Math.round(progress * 100)}%`, width / 2, height / 2);
    const barWidth = width * 0.6;
    const barX = (width - barWidth) / 2;
    ctx.fillStyle = '#555';
    ctx.fillRect(barX, height / 2 + 30, barWidth, 20);
    ctx.fillStyle = '#4bd';
    ctx.fillRect(barX, height / 2 + 30, barWidth * progress, 20);
  }
}