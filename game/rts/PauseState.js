import { MenuState } from './MenuState.js';

export class PauseState {
  init(stateManager) {
    this.stateManager = stateManager;
    this.canvas = stateManager.canvas;
    
    // Botones como en la imagen de RPG (sin "Opciones")
    this.buttons = [
      { text: "Continuar", action: 'resume' },
      { text: "Menu Principal", action: 'menu' },
      { text: "Salir", action: 'exit' },
    ];
    this.selectedButton = 0;
  }

  handleInput(event) {
    if (event.type !== 'keydown') return;
    const key = event.key.toLowerCase();

    // Cerrar pausa con Escape o con 'u' (respaldo)
    if (key === 'escape' || key === 'u') {
      this.stateManager.pop(); // Cierra este estado y vuelve al juego
      return;
    }

    // Navegación del menú
    if (key === 'w' || key === 'arrowup') {
      this.selectedButton = (this.selectedButton > 0) ? this.selectedButton - 1 : this.buttons.length - 1;
    }
    if (key === 's' || key === 'arrowdown') {
      this.selectedButton = (this.selectedButton < this.buttons.length - 1) ? this.selectedButton + 1 : 0;
    }

    // Seleccionar opción
    if (key === 'enter' || key === 'e') {
      this.selectOption();
    }
  }

  selectOption() {
    const action = this.buttons[this.selectedButton].action;
    
    switch (action) {
      case 'resume':
        this.stateManager.pop(); // Vuelve al juego
        break;
      case 'menu':
        this.stateManager.set(new MenuState()); // Vuelve al menú principal
        break;
      case 'exit':
        // "Salir" también vuelve al menú, ya que no podemos cerrar la pestaña
        this.stateManager.set(new MenuState());
        break;
    }
  }

  update(dt) {
    // No hace nada, pausando así el juego
  }

  render(ctx) {
    // 1. Dibuja el overlay oscuro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const menuX = ctx.canvas.width / 2;
    const menuY = ctx.canvas.height / 2 - 100;
    
    // 2. Título "PAUSA"
    ctx.fillStyle = '#eee';
    ctx.font = '50px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSA', menuX, menuY);
    
    // 3. Dibuja los botones
    ctx.font = '30px system-ui';
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      const buttonY = menuY + 80 + (i * 50);
      
      if (i === this.selectedButton) {
        // Botón seleccionado
        ctx.fillStyle = 'yellow';
        ctx.fillText(`> ${button.text} <`, menuX, buttonY);
      } else {
        // Botón no seleccionado
        ctx.fillStyle = '#eee';
        ctx.fillText(button.text, menuX, buttonY);
      }
    }
  }
}