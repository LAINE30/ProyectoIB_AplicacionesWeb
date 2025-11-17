export class PauseState {
    init(manager) {
        this.manager = manager;

        window.addEventListener("keydown", this.keyHandler = (e) => {
            if (e.key === "Escape") {
                manager.pop(); // volver al juego
            }
        });
    }

    render(ctx) {
        const { width, height } = ctx.canvas;

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSA", width / 2, height / 2);
        ctx.fillText("Presiona ESC para continuar", width / 2, height / 2 + 40);
    }

    exit() {
        window.removeEventListener("keydown", this.keyHandler);
    }
}
