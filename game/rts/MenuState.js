import { RTSState } from './RTSState.js';

export class MenuState {
  init(stateManager) {
    this.stateManager = stateManager;
  }

  handleInput(event) {
    if (event.type === 'keydown' || event.type === 'mousedown') {
      this.stateManager.set(new RTSState());
    }
  }

  update(dt) {}

  render(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#0f0f10';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.fillStyle = '#eee';
    ctx.font = '40px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Mi Juego de Misiones', ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
    
    ctx.font = '20px system-ui';
    ctx.fillText('Presiona cualquier tecla o haz clic para comenzar', ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
  }
}