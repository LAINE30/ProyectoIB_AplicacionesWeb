import { MenuState } from "./MenuState.js";

export class GameOverState {
    init(manager) {
        this.manager = manager;

        window.addEventListener("keydown", this.keyHandler = (e) => {
            if (e.key === "Enter") {
                manager.set(new MenuState());
            }
        });
    }

    render(ctx) {
        const { width, height } = ctx.canvas;

        ctx.fillStyle = "darkred";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2 - 20);
        ctx.fillText("Presiona ENTER para volver al menú", width / 2, height / 2 + 20);
    }

    exit() {
        window.removeEventListener("keydown", this.keyHandler);
    }
}
