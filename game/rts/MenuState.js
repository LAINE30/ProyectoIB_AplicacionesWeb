import { RTSState } from './RTSState.js';

export class MenuState {
  init(stateManager) {
    this.stateManager = stateManager;
    this.canvas = stateManager.canvas;
    this.loader = stateManager.loader;

    // --- AUDIO ---
    this.menuMusic = this.loader.get('menuMusic');

    if (this.menuMusic) {
      this.menuMusic.loop = true;
      this.menuMusic.volume = 0.05;

      // Intento inicial
      this.tryPlayMusic();

      // Listener para desbloquear autoplay
      this._onUserInteract = () => {
        if (this.menuMusic.paused) {
          this.menuMusic.play().catch(() => {});
        }
        // limpiar después de usarse una vez
        window.removeEventListener("pointerdown", this._onUserInteract);
        window.removeEventListener("keydown", this._onUserInteract);
      };

      window.addEventListener("pointerdown", this._onUserInteract, { passive: true });
      window.addEventListener("keydown", this._onUserInteract, { passive: true });
    }

    // --- Carga de fondo ---
    this.background = new Image();
    this.isBgLoaded = false;
    this.background.onload = () => (this.isBgLoaded = true);
    this.background.src = "/assets/Fondos/j92fMX.png";

    // --- Botones ---
    this.buttons = [
      { text: "Iniciar Nueva Partida", action: 'start' },
      { text: "Continuar", action: 'resume' },
      { text: "Modo Multijugador", action: 'multiplayer' },
      { text: "Salir", action: 'exit' },
    ];

    this.selectedButton = 0;
  }

  // Intenta reproducir la música del menú
  tryPlayMusic() {
    if (!this.menuMusic) return;

    this.menuMusic.play().catch(() => {
      console.warn("Autoplay bloqueado — esperando interacción del usuario.");
    });
  }

  // Importante: cuando salimos del menú,
  // debemos detener la música correctamente.
  onExit() {
    if (this.menuMusic) {
      this.menuMusic.pause();
      this.menuMusic.currentTime = 0;
    }
  }

  handleInput(event) {
    if (event.type !== 'keydown') return;
    const key = event.key.toLowerCase();

    if (key === 'escape') {
      this.stateManager.pop();
      return;
    }

    // Navegación
    if (key === 'w' || key === 'arrowup') {
      this.selectedButton =
        (this.selectedButton > 0)
          ? this.selectedButton - 1
          : this.buttons.length - 1;
    }

    if (key === 's' || key === 'arrowdown') {
      this.selectedButton =
        (this.selectedButton < this.buttons.length - 1)
          ? this.selectedButton + 1
          : 0;
    }

    // Selección
    if (key === 'enter' || key === 'e') {
      this.selectOption();
    }
  }

  selectOption() {
    const action = this.buttons[this.selectedButton].action;

    switch (action) {
      case 'start':{
        this.onExit(); // <<< Detener música del menú
        this.stateManager.set(new RTSState());
        break;
      }

      case 'resume': {
        this.onExit(); // <<< Detener música del menú
        this.stateManager.set(new RTSState());
        break;
      }

      case 'multiplayer':
        console.log("Modo multijugador no implementado aún.");
        break;

      case 'exit':
        console.log("Salir del juego.");
        break;
    }
  }

  update(dt) {}

  render(ctx) {
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // Fondo
    if (this.isBgLoaded) {
      ctx.drawImage(this.background, 0, 0, cw, ch);
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
    }

    // Título
    ctx.fillStyle = '#eee';
    ctx.font = '40px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Reinos de Luminaria', cw / 2, 80);

    // Botones
    const startY = ch / 2 - (this.buttons.length * 25);
    ctx.font = '24px system-ui';

    for (let i = 0; i < this.buttons.length; i++) {
      const btn = this.buttons[i];
      const y = startY + i * 50;

      if (i === this.selectedButton) {
        const textWidth = ctx.measureText(btn.text).width;
        const padding = 16;

        ctx.fillStyle = '#2b6cb0';
        ctx.fillRect(
          cw / 2 - textWidth / 2 - padding,
          y - 28,
          textWidth + padding * 2,
          40
        );

        ctx.fillStyle = '#fff';
      } else {
        ctx.fillStyle = '#ddd';
      }

      ctx.fillText(btn.text, cw / 2, y);
    }

    ctx.font = '16px system-ui';
    ctx.fillStyle = '#aaa';
    ctx.fillText(
      'Usa W/S o flechas para navegar, Enter para seleccionar',
      cw / 2,
      ch - 60
    );
  }
}
