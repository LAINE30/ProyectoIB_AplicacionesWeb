import { MenuState } from './MenuState.js';

export class GameOverState {
  init(stateManager) {
    this.stateManager = stateManager;
  }

  handleInput(event) {
    if (event.type === 'keydown' || event.type === 'mousedown') {
      this.stateManager.set(new MenuState());
    }
  }

  update(dt) {}

  render(ctx) {
    ctx.fillStyle = '#0f0f10';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.fillStyle = '#eee';
    ctx.font = '40px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('¡JUEGO COMPLETADO!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
    
    ctx.font = '20px system-ui';
    ctx.fillText('¡Completaste todas las misiones!', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText('Haz clic para volver al Menú', ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
  }
}