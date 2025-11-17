import { RTSState } from './RTSState.js';

export class MenuState {
  init(stateManager) {
    this.stateManager = stateManager;
    this.loader = stateManager.loader;
    this.canvas = stateManager.canvas;

    // Opciones del menú
    this.buttons = [
      { text: 'Iniciar Partida', action: 'start' },
      { text: 'Cargar Partida', action: 'load' },
      { text: 'Salir', action: 'exit' }
    ];
    this.selectedButton = 0;

    // Intentamos obtener la imagen de fondo (debe estar cargada por LoadingState)
    this.bg = this.loader.get('menuBackground');
  }

  handleInput(event) {
    if (event.type !== 'keydown' && event.type !== 'mousedown') return;

    if (event.type === 'keydown') {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') {
        this.selectedButton = (this.selectedButton > 0) ? this.selectedButton - 1 : this.buttons.length - 1;
      }
      if (key === 's' || key === 'arrowdown') {
        this.selectedButton = (this.selectedButton < this.buttons.length - 1) ? this.selectedButton + 1 : 0;
      }
      if (key === 'enter' || key === 'e' || key === ' ') {
        this.selectOption();
      }
    }

    if (event.type === 'mousedown') {
      // Soporte básico de click: determina qué botón fue clickeado por coordenadas
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = this.canvas.width / 2;
      const startY = this.canvas.height / 2;
      for (let i = 0; i < this.buttons.length; i++) {
        const buttonY = startY + i * 50;
        const textWidth = 300; // área aproximada
        if (x > centerX - textWidth && x < centerX + textWidth && y > buttonY - 24 && y < buttonY + 12) {
          this.selectedButton = i;
          this.selectOption();
          break;
        }
      }
    }
  }

  selectOption() {
    const action = this.buttons[this.selectedButton].action;
    switch (action) {
      case 'start':
        this.stateManager.set(new RTSState());
        break;
      case 'load':
        // Placeholder: implementaremos carga real más adelante
        console.log('Cargar Partida seleccionado (no implementado aún)');
        break;
      case 'exit':
        // Intentar cerrar la pestaña (puede ser bloqueado por el navegador)
        window.close();
        break;
    }
  }

  update(dt) {}

  render(ctx) {
    // Dibujar fondo (si está disponible)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.bg) {
      try {
        ctx.drawImage(this.bg, 0, 0, ctx.canvas.width, ctx.canvas.height);
      } catch (e) {
        // Si falló el drawImage, caeremos al fondo sólido
        ctx.fillStyle = '#0f0f10';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    } else {
      ctx.fillStyle = '#0f0f10';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    const menuX = ctx.canvas.width / 2;
    const menuY = ctx.canvas.height / 2 - 60;

    // Título
    ctx.fillStyle = '#fff';
    ctx.font = '48px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Mythra Quest', menuX, menuY);

    // Botones
    ctx.font = '28px system-ui';
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      const buttonY = menuY + 60 + (i * 50);
      if (i === this.selectedButton) {
        ctx.fillStyle = 'yellow';
        ctx.fillText(`> ${button.text} <`, menuX, buttonY);
      } else {
        ctx.fillStyle = '#eee';
        ctx.fillText(button.text, menuX, buttonY);
      }
    }
  }
}