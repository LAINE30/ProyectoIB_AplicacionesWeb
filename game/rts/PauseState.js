import { MenuState } from './MenuState.js';

export class PauseState {
    init(stateManager) {
        this.stateManager = stateManager;
        this.canvas = stateManager.canvas;

        // === Fondo de pausa ===
        this.background = new Image();
        this.isBgLoaded = false;
        this.background.src = "/assets/Fondos/j92fMX.png"; // la misma imagen del menú
        this.background.onload = () => {
            this.isBgLoaded = true;
        };

        // === Botones ===
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

        if (key === 'escape' || key === 'u') {
            this.stateManager.pop();
            return;
        }

        if (key === 'w' || key === 'arrowup') {
            this.selectedButton =
                this.selectedButton > 0
                    ? this.selectedButton - 1
                    : this.buttons.length - 1;
        }
        if (key === 's' || key === 'arrowdown') {
            this.selectedButton =
                this.selectedButton < this.buttons.length - 1
                    ? this.selectedButton + 1
                    : 0;
        }

        if (key === 'enter' || key === 'e') {
            this.selectOption();
        }
    }

    selectOption() {
        const action = this.buttons[this.selectedButton].action;

        switch (action) {
            case 'resume':
                this.stateManager.pop();
                break;
            case 'menu':
                this.stateManager.set(new MenuState());
                break;
            case 'exit':
                this.stateManager.set(new MenuState());
                break;
        }
    }

    update(dt) {}

    render(ctx) {
        const cw = ctx.canvas.width;
        const ch = ctx.canvas.height;

        ctx.clearRect(0, 0, cw, ch);

        // === 1. Fondo PNG ===
        if (this.isBgLoaded) {
            ctx.drawImage(this.background, 0, 0, cw, ch);
        } else {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, cw, ch);
        }

        // === 2. Oscurecimiento para pausa ===
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, 0, cw, ch);

        // === 3. Título ===
        ctx.fillStyle = "#fff";
        ctx.font = "50px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("PAUSA", cw / 2, 120);

        // === 4. Botones ===
        const startY = ch / 2 - (this.buttons.length * 25);
        ctx.font = "28px system-ui";

        for (let i = 0; i < this.buttons.length; i++) {
            const btn = this.buttons[i];
            const y = startY + i * 60;

            const textWidth = ctx.measureText(btn.text).width;
            const padding = 18;

            // Fondo del botón
            ctx.fillStyle =
                i === this.selectedButton
                    ? "rgba(255, 215, 0, 0.80)" // amarillo fuerte
                    : "rgba(255, 255, 255, 0.35)"; // blanco translúcido

            ctx.fillRect(
                cw / 2 - textWidth / 2 - padding,
                y - 32,
                textWidth + padding * 2,
                50
            );

            // Texto del botón
            ctx.fillStyle = "#fff";
            ctx.fillText(btn.text, cw / 2, y);
        }

        // === 5. Instrucción ===
        ctx.font = "16px system-ui";
        ctx.fillStyle = "#ddd";
        ctx.fillText("Presiona ESC para continuar", cw / 2, ch - 40);
    }
}
